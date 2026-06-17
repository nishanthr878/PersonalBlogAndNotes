---
title: Quick Reference for Authentication
date: 2026-06-17
description: Detail quick refrence for Authentication
tags:
  - meta
  - writing
draft: false
---

# Auth Concepts — Quick Reference

> Ordered from fundamentals to complex. Each concept builds on the ones before it.

---

## Layer 1 — Identity Fundamentals

---

## Authentication vs Authorization
**What:** AuthN = proving who you are. AuthZ = proving what you're allowed to do.
**Why it matters:** They are completely separate concerns — knowing identity doesn't grant access.
**Gotcha:** Most systems conflate them. Getting AuthN right doesn't mean AuthZ is correct. A valid JWT proves identity — it doesn't automatically mean the user can access every endpoint.
```
AuthN → "Are you who you claim to be?"
         Handled by: login, JWT validation, OAuth2/OIDC

AuthZ → "Are you allowed to do this?"
         Handled by: roles, permissions, @PreAuthorize, SecurityConfig rules
```
**Remember:** Always ask both questions separately. A user can be authenticated but not authorized.

---

## Authentication Factor Hierarchy
**What:** A ranking of authentication methods from weakest to strongest based on attack resistance.
**Why it matters:** Choosing the wrong factor for a threat model is a false sense of security.
**Gotcha:** SMS OTP feels secure but is SIM-swappable and phishable. It's theater, not real security — almost as weak as password alone.
```
Weakest → Strongest:

Password only          → phishable, reusable, predictable
Password + SMS OTP     → SIM-swappable, phishable — barely better
Password + TOTP        → better, still phishable (fake login page captures both)
Hardware Key / Passkey → phishing-resistant, domain-bound, cryptographic
mTLS                   → gold standard for service-to-service auth
```
**Remember:** Phishing-resistance is the real threshold. Only hardware keys and passkeys cross it for users. Only mTLS crosses it for services.

---

## BCrypt Password Hashing
**What:** A deliberately slow hashing algorithm that turns a password into an irreversible string.
**Why it matters:** If your DB is breached, attackers can't recover the original passwords.
**Gotcha:** MD5/SHA256 are too fast — GPUs can crack them in seconds. BCrypt's slowness is the feature, not a bug.
```java
// Encode on register
passwordEncoder.encode(request.password())

// Spring does verification automatically during login via DaoAuthenticationProvider
// You never call checkpw() manually
```
**Remember:** Never store plaintext. Never compare plaintext to hash manually — let Spring do it.

---

## TOTP — How Authenticator Apps Work
**What:** Time-based One Time Password — both client and server compute the same code independently using a shared secret and the current time.
**Why it matters:** No network call needed for verification — pure math on both ends.
**Gotcha:** TOTP is still phishable. A fake login page can capture the code in real time and replay it within the 30-second window. It's stronger than passwords alone but not phishing-resistant.
```
Setup:
  Server generates a shared secret key → sends to client (QR code)
  Client stores it in authenticator app

Every 30 seconds:
  Client computes: HMAC(secret, floor(currentTime / 30))
  Server computes: HMAC(secret, floor(currentTime / 30))
  If they match → verified

No server call needed — both sides do the same math independently
```
**Remember:** The secret key is shared once during setup and never again. If it leaks, the factor is compromised permanently — unlike a password you can change.

---

## WebAuthn / Passkeys
**What:** Asymmetric cryptography-based authentication where the private key never leaves your device.
**Why it matters:** Phishing-resistant — the key is domain-bound, so a fake login page on a different domain can never trigger it.
**Gotcha:** Biometrics (Face ID, fingerprint) do NOT send biometric data to the server. They locally unlock the private key stored in the device's Secure Enclave. The server only ever sees a cryptographic signature.
```
Setup:
  Device generates public/private key pair
  Private key → stored in Secure Enclave / TPM chip, never leaves
  Public key  → sent to and stored on server

Login:
  Server sends a random challenge
  Device signs challenge with private key (biometric unlocks it locally)
  Server verifies signature with stored public key
  → No password, no shared secret, no phishable data
```
**Remember:** If the private key is tied to a domain, it only works on that exact domain. Attacker's fake login page on a different domain gets nothing.

---

## JWT Structure
**What:** Three base64-encoded parts (header.payload.signature) that form a self-contained, tamper-evident token.
**Why it matters:** Server can verify identity without a DB lookup — pure math.
**Gotcha:** The payload is NOT encrypted — just encoded. Anyone can decode and read it. Never put sensitive data (passwords, card numbers) in a JWT.
```java
// Three parts separated by dots:
// header.payload.signature

// Payload decoded looks like this:
{
  "sub": "d587206e-d0be-44af",  // user UUID — not email, UUID is permanent
  "role": "ROLE_USER",
  "iat": 1775834127,
  "exp": 1775835027             // 15 min from iat
}
```
**Remember:** `sub` must be the UUID, not the email — email can change, UUID never does.

---

## JWT Signing & Verification
**What:** HMAC signature computed from header+payload using a secret key — proves the token wasn't tampered with.
**Why it matters:** One character changed in the payload = signature mismatch = token rejected. No DB needed.
**Gotcha:** If your secret key leaks, attackers can forge any token with any claims. Rotate it immediately if compromised. The key must be at least 256 bits — JJWT enforces this and throws if the key is too short.
```java
// Sign on issue
Jwts.builder()
    .subject(userId)
    .signWith(getSigningKey())  // HMAC-SHA384
    .compact();

// Verify on every request — throws JwtException if tampered or expired
Jwts.parser()
    .verifyWith(getSigningKey())
    .build()
    .parseSignedClaims(token);
```
**Remember:** Catch `JwtException` broadly — it covers expired, tampered, malformed, and unsupported tokens in one catch block. All of them mean the same thing: reject the request.

---

## Layer 2 — Token Mechanics

---

## Access Token vs Refresh Token
**What:** Access token = short-lived JWT for API calls. Refresh token = long-lived UUID stored in DB for getting new access tokens.
**Why it matters:** Short access token limits damage if stolen. Refresh token enables revocation and persistent sessions.
**Gotcha:** The refresh token is a UUID, not a JWT. It looks like `550e8400-e29b-41d4`. Sending a JWT to the refresh endpoint will always return "not found" because JWTs are never stored in the DB.
```java
// Access token — JWT, never stored on server
String accessToken = jwtService.generateAccessToken(user); // eyJhbGci...

// Refresh token — random UUID, always stored in DB
String refreshToken = UUID.randomUUID().toString();        // 550e8400-...
refreshTokenRepository.save(RefreshToken.builder()
    .token(refreshToken)
    .user(user)
    .expiresAt(Instant.now().plusMillis(refreshTokenExpiry))
    .revoked(false)
    .build());
```
**Remember:** Access token lives only on the client. Refresh token lives on both client and server DB.

---

## RefreshToken.isValid()
**What:** A single method that combines both revocation and expiry checks before trusting a refresh token.
**Why it matters:** A token can be invalid for two independent reasons — revoked (logout/rotation) or expired (time). Both must be checked.
**Gotcha:** Checking only `revoked` misses expired tokens. Checking only `expiresAt` misses revoked tokens. You need both.
```java
// RefreshToken.java
public boolean isExpired() {
    return Instant.now().isAfter(expiresAt);
}

public boolean isValid() {
    return !revoked && !isExpired(); // both conditions must pass
}

// AuthService.java — single check covers both failure modes
if (!stored.isValid()) {
    refreshTokenRepository.revokeAllByUser(stored.getUser());
    throw new IllegalArgumentException("Refresh token invalid. All sessions revoked.");
}
```
**Remember:** Always check both. A not-revoked but expired token is still invalid. A not-expired but revoked token is still invalid.

---

## Refresh Token Rotation
**What:** Every time a refresh token is used, it is immediately revoked and a new one is issued.
**Why it matters:** Detects token theft — if an old (already rotated) token is used again, someone stole it.
**Gotcha:** When theft is detected, the legitimate user is also logged out. That's intentional — they'll know something is wrong and re-login.
```java
// AuthService.refresh()
if (!stored.isValid()) {
    // Reuse of a rotated/revoked token = theft signal
    refreshTokenRepository.revokeAllByUser(stored.getUser()); // lock everyone out
    throw new IllegalArgumentException("All sessions revoked.");
}
// Rotate — kill old, issue new
stored.setRevoked(true);
refreshTokenRepository.save(stored);
return issueTokens(stored.getUser()); // new pair
```
**Remember:** A revoked token presented again = nuclear response. Revoke everything for that user.

---

## The Logout Gap (Stateless Trade-off)
**What:** After logout, the access token remains technically valid until it expires (up to 15 min) because JWTs can't be invalidated server-side.
**Why it matters:** There is no perfect logout in a stateless JWT system. This is a fundamental trade-off, not a bug.
**Gotcha:** Logout only revokes refresh tokens in the DB. The access token has no server-side record to delete — it lives until `exp`.
```
Logout flow:
  refresh_tokens → all set revoked=true in DB  ✓ immediate effect
  access token   → nothing, lives until exp    ✗ up to 15 min window

Production mitigations:
  1. Keep access token expiry very short (1–5 min)
  2. Token blacklist in Redis (reintroduces state, but fast)
  3. Accept the 15-min window as tolerable risk
```
**Remember:** Stateless = you trade control for speed. Short expiry is the primary mitigation.

---

## Layer 3 — Protocol Layer

---

## OAuth2 — Roles and Purpose
**What:** A delegation framework that lets a user grant an app limited access to their resources on another service without sharing credentials.
**Why it matters:** Solves "I want App X to read my Google Drive" without giving App X your Google password.
**Gotcha:** OAuth2 is NOT authentication. It tells you what a user authorized — not who they are. Using an OAuth2 access token to identify a user is wrong.
```
Four roles:
  Resource Owner      → you, the user
  Client              → the app requesting access (your Spring Boot app)
  Authorization Server → issues tokens (Google, GitHub, Okta)
  Resource Server     → the API being accessed (Google Drive API)

What OAuth2 answers:  "What can this app do on your behalf?"
What OAuth2 does NOT: "Who is this user?"
```
**Remember:** OAuth2 = authorization. Not authentication. Never conflate them.

---

## Front Channel vs Back Channel
**What:** Front channel = communication through the browser (visible in URLs). Back channel = direct server-to-server HTTP call (browser never sees it).
**Why it matters:** Tokens must never travel through the browser URL — they appear in logs, history, and referrer headers.
**Gotcha:** The authorization code travels through the browser (front channel). The actual tokens never do. Confusing this is how tokens end up in server logs.
```
Front channel (browser sees this):
  → Authorization code only
  → Short-lived (60 sec), single-use, useless without client_secret

Back channel (browser never sees this):
  → Your server POSTs directly to token endpoint
  → Sends: code + client_secret
  → Receives: access_token, refresh_token, id_token
  → Response goes to your server only

The split is the entire security model of the Authorization Code flow.
```
**Remember:** Code through the browser. Tokens through the server. Never the other way around.

---

## PKCE — Proof Key for Code Exchange
**What:** A mechanism that binds the authorization request to the token exchange, so an intercepted code is useless without the original verifier.
**Why it matters:** SPAs and mobile apps can't store a `client_secret` safely — PKCE replaces it with a per-request cryptographic proof.
**Gotcha:** PKCE is now recommended for ALL clients, not just public ones. Even server-side apps with a `client_secret` benefit from it as an additional layer.
```
1. App generates random string          → code_verifier  (kept secret)
2. App hashes it                        → code_challenge = SHA256(code_verifier)
3. Sends code_challenge in auth request → server stores it
4. Gets back authorization code
5. Token exchange: sends code_verifier
6. Server hashes it, compares with stored code_challenge
7. Match → tokens issued. No match → rejected.

Intercepted code alone is useless — attacker doesn't have code_verifier.
```
**Remember:** `code_verifier` never leaves the app. `code_challenge` is the only thing that goes to the server during the auth request.

---

## OAuth2 Authorization Code Flow
**What:** The most secure OAuth2 flow — splits the exchange across front and back channels so tokens never touch the browser.
**Why it matters:** Every other flow (implicit, password) has known security issues. Authorization Code is the only one you should use.
**Gotcha:** The `state` parameter is not optional — it prevents CSRF attacks on the OAuth2 callback. Always generate, send, and verify it.
```
1. App redirects user to Auth Server:
   /authorize?response_type=code&client_id=...&redirect_uri=...&scope=openid&state=random

2. User authenticates with Auth Server

3. Auth Server redirects back with code (front channel):
   /callback?code=AUTH_CODE&state=random

4. App verifies state matches what it sent (CSRF prevention)

5. App server POSTs to token endpoint (back channel):
   code + client_id + client_secret (or PKCE verifier)

6. Auth Server returns tokens directly to app server

7. Browser never sees the tokens
```
**Remember:** Always verify `state` on the callback. Skip it and your OAuth2 flow is CSRF-vulnerable.

---

## Layer 4 — Identity Layer (OIDC & SAML)

---

## OIDC — OpenID Connect
**What:** A thin identity layer on top of OAuth2 that standardizes how apps learn who the user is.
**Why it matters:** OAuth2 alone can't tell you who the user is. OIDC adds the ID token and a standard `/userinfo` endpoint.
**Gotcha:** Adding `openid` to the scope is what activates OIDC. Without it you get an access token but no ID token — you know what was authorized but not who the user is.
```
OAuth2 alone:
  scope=profile → access token only → can call API, but WHO is the user? Unknown.

OIDC (OAuth2 + openid scope):
  scope=openid profile → access token + ID token (always a JWT)

ID Token payload:
{
  "iss": "https://accounts.google.com",  // issuer — who made this token
  "sub": "1234567890",                   // stable unique user ID
  "aud": "your-client-id",              // audience — must be YOUR app
  "exp": 1711480800,                    // expiry
  "nonce": "abc123",                    // replay prevention
  "email": "user@gmail.com"
}
```
**Remember:** ID token = for YOUR APP (who logged in). Access token = for the RESOURCE SERVER (what to access). Never send an ID token to your API.

---

## OIDC Discovery Document
**What:** A self-describing JSON metadata endpoint every OIDC provider exposes at `/.well-known/openid-configuration`.
**Why it matters:** Your app can bootstrap all endpoint URLs from one place — no hardcoding authorization, token, or JWKS endpoints.
**Gotcha:** Always fetch endpoints from the discovery document rather than hardcoding them. Providers change URLs — your app should not break when they do.
```
GET https://accounts.google.com/.well-known/openid-configuration

Returns:
{
  "issuer": "https://accounts.google.com",
  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
  "token_endpoint": "https://oauth2.googleapis.com/token",
  "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",
  "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
  "scopes_supported": ["openid", "email", "profile"]
}
```
**Remember:** `jwks_uri` is how you get the public keys to verify ID token signatures — always fetch from here, never hardcode the key.

---

## OIDC Scopes
**What:** Scopes declare what information about the user your app is requesting from the IdP.
**Why it matters:** You only get back what you ask for — and you should only ask for what you need (principle of least privilege).
**Gotcha:** `openid` is the only mandatory scope to activate OIDC. Everything else is optional. Requesting unnecessary scopes is a privacy violation and can cause users to reject the consent screen.
```
openid   → activates OIDC, gives you sub only
profile  → name, picture, locale, birthdate
email    → email, email_verified
address  → structured address object
phone    → phone_number, phone_number_verified

Example:
  scope=openid email → you get sub + email only
  scope=openid profile email → you get sub + name + picture + email
```
**Remember:** Always request the minimum scopes needed. Users see these on the consent screen — unnecessary scopes reduce trust and conversion.

---

## ID Token Validation
**What:** A mandatory sequence of checks on the ID token before trusting the identity it contains.
**Why it matters:** Skipping any check opens you to forged tokens, expired tokens, or tokens from a different app being accepted as valid.
**Gotcha:** Skipping the `aud` check is the most common mistake — without it, a token issued for a completely different application can be used against yours.
```
Every check is mandatory — skip one = security hole:

1. Fetch public key from jwks_uri (discovery document)
2. Verify signature using that public key
3. Verify iss === expected provider URL
4. Verify aud === YOUR client_id (not someone else's)
5. Verify exp > current_time
6. Verify nonce === nonce you sent in the original request
```
**Remember:** Use `sub` as your internal user identity — not email. Email can change, `sub` is permanent and stable across all tokens from that provider.

---

## SAML — Security Assertion Markup Language
**What:** An XML-based federated identity protocol from 2002 that solves the same problem as OIDC but for enterprise systems.
**Why it matters:** Large enterprises and governments often mandate SAML. You'll encounter it whether you want to or not.
**Gotcha:** SAML XML signature validation is notoriously tricky — XML wrapping attacks, comment injection, namespace issues. Never roll your own SAML parser. Use a battle-tested library.
```
Terminology:
  IdP (Identity Provider) → authenticates users (Okta, ADFS, OneLogin)
  SP  (Service Provider)  → your app that trusts the IdP
  Assertion               → the XML document proving authentication

Flow:
  1. User hits your app (SP) → no session → redirect to IdP
  2. App sends SAML AuthnRequest XML (base64 encoded) to IdP
  3. IdP authenticates user
  4. IdP HTTP POSTs SAML Response XML to your ACS endpoint
     (ACS = Assertion Consumer Service = your callback URL)
  5. Your app validates the XML assertion → creates session
```
**Remember:** ACS is just your callback endpoint that receives the SAML POST. The IdP POSTs to it — your app doesn't redirect the browser there.

---

## SAML vs OIDC
**What:** Two protocols that solve the same federated identity problem — different era, different format, different complexity.
**Why it matters:** Knowing which to use (and why) prevents you from choosing the wrong tool or being caught off guard in enterprise integrations.
**Gotcha:** Both can coexist. Okta and Azure AD support both. Enterprise employees often use SAML (company mandates), while external users and API clients use OIDC.
```
                SAML              OIDC
Born            2002              2014
Format          XML               JSON + JWT
Complexity      High              Low
Mobile          No                Yes
API friendly    No                Yes
Use when        Enterprise/legacy Anything new

Concept mapping:
  User identity   → XML Assertion       → ID Token (JWT)
  Unique user ID  → NameID              → sub claim
  Expiry          → NotOnOrAfter        → exp claim
  Replay prevent  → InResponseTo        → nonce
  Public keys     → X.509 cert          → JWKS endpoint
```
**Remember:** Default to OIDC for anything new. Use SAML only when the enterprise client mandates it or the IdP speaks nothing else.

---

## Layer 5 — Spring Security Wiring

---

## UserDetails & UserDetailsService
**What:** `UserDetails` is Spring Security's user contract. `UserDetailsService` is how Spring loads a user from your storage.
**Why it matters:** Spring Security doesn't know about your `User` entity — these interfaces are the bridge.
**Gotcha:** In Spring Security 6, `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()`, `isEnabled()` became default interface methods. Adding `@Override` causes a compilation error.
```java
// User.java implements UserDetails directly — no translation layer needed
public class User implements UserDetails {
    @Override
    public String getUsername() { return email; } // email is our "username"

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    // NO @Override in Spring Security 6 — these are now default methods
    public boolean isAccountNonExpired()     { return true; }
    public boolean isAccountNonLocked()      { return true; }
    public boolean isCredentialsNonExpired() { return true; }
    public boolean isEnabled()               { return true; }
}

// UserDetailsServiceImpl — Spring calls this during authentication
public UserDetails loadUserByUsername(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Not found"));
}
```
**Remember:** `getUsername()` does NOT have to return a username field — return whatever your unique identifier is. For us it's email.

---

## DaoAuthenticationProvider
**What:** Spring Security's built-in component that verifies email + password using your `UserDetailsService` and `PasswordEncoder`.
**Why it matters:** You don't write credential verification logic — you wire beans and Spring handles it correctly.
**Gotcha:** You must expose `AuthenticationManager` as a `@Bean` explicitly. Spring creates it internally but doesn't expose it by default — injecting it without the bean declaration fails at startup.
```java
// SecurityConfig.java — wire it up
@Bean
public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}

// Expose AuthenticationManager so AuthService can inject it
@Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}

// AuthService.java — one line replaces all credential verification logic
authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(email, password)
); // throws BadCredentialsException if wrong
```
**Remember:** Calling `authenticationManager.authenticate()` is all you need for login — Spring loads the user, verifies the password, throws on failure.

---

## SecurityContext
**What:** A per-request container that holds the authenticated user's identity and authorities.
**Why it matters:** Every part of your application (controllers, services) can access the current user without passing it around manually.
**Gotcha:** It is wiped after every request — nothing persists between requests. This is what STATELESS actually means in practice.
```java
// JwtAuthFilter sets it after validating the token
SecurityContextHolder.getContext().setAuthentication(authToken);

// Controller reads it via @AuthenticationPrincipal — no manual parsing needed
public ResponseEntity<?> me(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(user.getEmail());
}
```
**Remember:** `SecurityContext` is thread-local — only available in the same thread handling the request. Don't pass it across threads.

---

## JwtAuthFilter
**What:** A `OncePerRequestFilter` that intercepts every request, validates the JWT, and populates the `SecurityContext`.
**Why it matters:** Without this, Spring Security has no idea who is making the request.
**Gotcha:** If no token is present, pass through — don't reject. Public endpoints (`/auth/**`) have no token. Let `SecurityConfig` decide if auth is required, not this filter.
```java
// Pass through if no token — don't reject here
if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    filterChain.doFilter(request, response);
    return;
}

// Only set auth if not already authenticated — don't overwrite
if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    // load user → build auth token → set in SecurityContext
}

// Always continue the chain — never stop here
filterChain.doFilter(request, response);
```
**Remember:** `OncePerRequestFilter` guarantees the filter runs exactly once per request — without it, the JWT can be processed multiple times in the same request lifecycle.

---

## Filter Chain Order
**What:** Spring Security processes requests through an ordered chain of filters — position determines what each filter can see and do.
**Why it matters:** If `JwtAuthFilter` runs after Spring's own filters, the SecurityContext is empty when Spring checks it and every request is rejected.
**Gotcha:** `addFilterBefore` doesn't mean "before all filters" — it means before one specific filter. You must specify `UsernamePasswordAuthenticationFilter` as the anchor point.
```java
// SecurityConfig.java
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

// Resulting order for JWT requests:
// 1. JwtAuthFilter          → validates JWT, populates SecurityContext
// 2. UsernamePasswordAuth.. → processes form login (we don't use this)
// 3. ExceptionTranslation.. → converts security exceptions to HTTP responses
// 4. FilterSecurityIntercep → checks authorization rules
// 5. Your Controller
```
**Remember:** Our filter must run first so the SecurityContext is populated before Spring's authorization checks fire.

---

## SessionCreationPolicy.STATELESS
**What:** Tells Spring Security to never create or use an `HttpSession`.
**Why it matters:** Forces every request to be independently authenticated via JWT — no server-side session state.
**Gotcha:** This does NOT mean your app has zero state. Refresh tokens in DB are state. STATELESS only means no `HttpSession` — don't confuse the two.
```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
)
```
**Remember:** Without this, Spring silently creates a session on first login and starts ignoring your JWT on subsequent requests — breaking auth in a way that's hard to debug.

---

## CSRF Protection
**What:** A security mechanism that prevents other websites from making requests using your authenticated session cookies.
**Why it matters:** CSRF attacks rely on browsers automatically sending cookies — not applicable when auth travels in `Authorization` headers.
**Gotcha:** Disabling CSRF is correct for JWT APIs. But if you ever switch to cookie-based auth, re-enable it — disabling CSRF with cookie auth is a real vulnerability.
```java
// Safe to disable for stateless JWT API — no cookies used for auth
.csrf(AbstractHttpConfigurer::disable)
```
**Remember:** CSRF only matters when authentication is carried in cookies. JWT in `Authorization: Bearer` header = browsers won't auto-attach it = no CSRF risk.

---

## Layer 6 — Authorization

---

## Role-Based Authorization (AuthZ)
**What:** Controlling what an authenticated user can do based on their assigned role.
**Why it matters:** AuthN (who are you?) and AuthZ (what can you do?) are separate concerns — knowing identity doesn't mean unlimited access.
**Gotcha:** `@EnableMethodSecurity` must be on your config class, otherwise `@PreAuthorize` is silently ignored — no error, no protection, no indication anything is wrong.
```java
// URL-level in SecurityConfig — checked before request reaches controller
.requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

// Method-level in controller — requires @EnableMethodSecurity on SecurityConfig
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<?> adminOnly() { ... }

// Role stored in JWT — no DB call needed per request
claims.put("role", user.getRole().name());
```
**Remember:** Use `hasAuthority("ROLE_ADMIN")` not `hasRole("ADMIN")` — `hasRole` auto-prepends "ROLE_", causing a silent mismatch if your enum already includes it.

---

## @AuthenticationPrincipal
**What:** Injects the currently authenticated user directly from the `SecurityContext` into your controller method.
**Why it matters:** No need to parse the token again or accept a user ID in the request body — Spring hands you the object.
**Gotcha:** The injected type must match what `JwtAuthFilter` set as the principal. We set a `User` object, so inject `User` — not `UserDetails`. Injecting the wrong type returns null.
```java
// Inject your concrete User entity — has all fields available
public ResponseEntity<?> me(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(user.getEmail()); // full entity, no casting
}

// Logout — no userId needed in request body, Spring provides it
public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
    authService.logout(userDetails.getUsername()); // email from SecurityContext
    return ResponseEntity.noContent().build();
}
```
**Remember:** If you inject `UserDetails` instead of `User`, you only get `getUsername()` and `getAuthorities()` — you lose access to entity-specific fields like `getId()`, `getRole()`.

---

## Layer 7 — Spring & JPA Mechanics

---

## GenerationType.UUID
**What:** Tells JPA to generate a UUID string as the primary key instead of an auto-incremented integer.
**Why it matters:** UUIDs don't expose how many users you have, can be generated without a DB round trip, and are safe to embed in JWTs as the `sub` claim.
**Gotcha:** Auto-increment integers in `sub` let attackers enumerate users — `sub=1`, `sub=2`, `sub=3`. UUIDs are opaque and non-sequential.
```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private String id;

// Generated value looks like:
// "d587206e-d0be-44af-86fd-8367148f6efe"
// Not: 1, 2, 3...
```
**Remember:** Never use auto-increment integers as user-facing identifiers. UUIDs are non-guessable and non-enumerable.

---

## @Modifying on Repository Queries
**What:** Marks a `@Query` method as a write operation (UPDATE/DELETE) instead of a read.
**Why it matters:** Without it, Spring Data assumes all `@Query` methods are SELECT queries and throws an exception on UPDATE or DELETE.
**Gotcha:** `@Modifying` alone isn't enough for some operations — pair it with `@Transactional` on the method or the calling service to ensure the write is committed.
```java
@Modifying
@Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user = :user")
void revokeAllByUser(User user);

// Without @Modifying → InvalidDataAccessApiUsageException at runtime
// Without @Transactional on the caller → changes may not commit
```
**Remember:** Every JPQL UPDATE or DELETE needs `@Modifying`. Forgetting it gives a runtime exception that looks confusing if you don't know what to look for.

---

## Java Records for DTOs
**What:** Immutable data carrier classes that auto-generate constructor, `equals()`, `hashCode()`, and `toString()`.
**Why it matters:** DTOs carry data between layers — they have no business logic. Immutability enforces that nobody accidentally mutates a request object mid-processing.
**Gotcha:** Records can't be extended and have no setters. Don't use them for JPA entities — Hibernate needs a no-arg constructor and mutable fields.
```java
// DTO as record — immutable, concise, no boilerplate
public record RegisterRequest(
    @Email @NotBlank String email,
    @NotBlank @Size(min = 8) String password
) {}

// Access fields via accessor methods (not getters)
request.email()    // not request.getEmail()
request.password() // not request.getPassword()
```
**Remember:** Records are for DTOs, not entities. Hibernate requires mutable classes with no-arg constructors — use `@Entity` classes with Lombok instead.

---

## @Transactional on Service Methods
**What:** Wraps a method in a DB transaction — all operations succeed together or all roll back.
**Why it matters:** Without it, a failure halfway through (e.g. user saved but refresh token insert failed) leaves the DB in a corrupt state.
**Gotcha:** `@Transactional` only works when called from outside the class through Spring's proxy. Calling a `@Transactional` method from within the same class bypasses the proxy — no transaction wraps it.
```java
@Transactional
public AuthResponse register(RegisterRequest request) {
    userRepository.save(user);           // operation 1
    refreshTokenRepository.save(token);  // operation 2
    // if operation 2 fails → operation 1 also rolls back automatically
}
```
**Remember:** Put `@Transactional` on methods that perform multiple DB writes. A single read doesn't need it.

---

## GlobalExceptionHandler
**What:** A `@RestControllerAdvice` that catches exceptions thrown anywhere in the app and returns clean JSON error responses.
**Why it matters:** Without it, Spring returns an HTML error page — useless for API clients, and leaks stack traces in production.
**Gotcha:** A broad `catch(Exception.class)` that returns a generic message swallows the real error. You'll spend hours debugging a "something went wrong" with no idea what actually failed.
```java
// Always log in the catch-all — or you're flying blind
@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
    log.error("Unhandled exception: ", ex);          // full stack trace in logs
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", ex.getMessage())); // real message in dev
}
```
**Remember:** During development return `ex.getMessage()` not a hardcoded string. Switch to a generic message in production — never leak internal details to clients.

---

## H2 Console for Live DB Inspection
**What:** A browser-based SQL interface to your in-memory H2 database, available at `/h2-console` during development.
**Why it matters:** Lets you see exactly what's in `users` and `refresh_tokens` tables in real time — essential for debugging auth flows.
**Gotcha:** H2 uses iframes — Spring Security blocks them by default. You must explicitly allow same-origin frames or the console renders blank.
```properties
# application.properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.datasource.url=jdbc:h2:mem:authdb

# SecurityConfig.java — allow iframes for H2 console
.headers(headers -> headers
    .frameOptions(frame -> frame.sameOrigin())
)
```
```
Access at: http://localhost:8081/h2-console
JDBC URL:  jdbc:h2:mem:authdb
Username:  sa
Password:  (empty)
```
**Remember:** H2 is in-memory — all data is wiped on every restart. It's for development only. Never use it in production.

---

## Layer 8 — SSO & Session Management

---

## Two Sessions in SSO
**What:** SSO involves two completely separate, independent sessions — one on the IdP, one on each app.
**Why it matters:** Confusing them breaks your understanding of how SSO login, silent re-authentication, and logout work.
**Gotcha:** Logging out of one app destroys only that app's local session. The IdP SSO session stays alive — the user is still logged in everywhere else. True full logout requires Single Logout (SLO), which is complex and unreliable enough that most enterprises avoid it.
```
SSO Session  → lives on IdP domain
               created once when user first authenticates
               shared across ALL apps
               typically 8–24 hours

Local Session → lives on each individual app
                created after that app validates the IdP token
                independent per app
                typically 15 min–1 hour

Local session expires → app redirects to IdP with prompt=none
                      → IdP sees SSO session still alive
                      → issues new token silently
                      → user never notices → that's silent re-authentication
```
**Remember:** Two sessions, two lifetimes, two logout mechanisms. Destroying one does not destroy the other.

---

## Token Storage on the Client
**What:** Where you store access and refresh tokens on the client determines your entire XSS and CSRF attack surface.
**Why it matters:** The wrong storage choice hands attackers your tokens on a silver platter.
**Gotcha:** JWT in localStorage is the most common anti-pattern on the internet. One XSS vulnerability anywhere on the page = all tokens stolen. We used Postman so it didn't matter — in a real frontend it absolutely does.
```
localStorage        → JS can read it → XSS steals token → Never use for tokens
sessionStorage      → JS can read it → XSS steals token → Still bad
Memory (JS var)     → XSS can't persist it → Good, but lost on page refresh
HttpOnly Cookie     → JS cannot read it at all → Best for refresh token
                      Needs SameSite=Strict + CSRF token for write operations

Production pattern:
  Access token  → JS memory (variable, lost on refresh → use short expiry)
  Refresh token → HttpOnly + Secure + SameSite=Strict cookie
```
**Remember:** HttpOnly means JavaScript cannot read the cookie — `document.cookie` won't show it. This is the property that defeats XSS token theft.