# Privacy Policy — Steady Increment

**Last updated: 27 August 2026**

Steady Increment is published by **Lonexa LLC** (Kentucky, United States).

This policy describes what the app stores, what leaves your device, and what
never does. It is written to be read rather than to be defensible, because the
architecture is genuinely simple: **the app is local-first, and most of it never
touches a server at all.**

---

## The short version

| | Where it lives |
|---|---|
| Everything you log — workouts, sets, cardio, plans, gyms, body metrics | **On your device**, in a database only this app can read |
| The same data, if you create an account | Also on our server, so a second device can see it |
| Progress photos | **On your device only. Never uploaded, under any circumstances.** |
| What the AI features see | Training numbers only — see *Artificial intelligence* below |
| Crash reports | Sent to Sentry when something breaks. No IP address, no account, nothing you logged |
| Which screens you open | **Only if you turn it on.** Off by default; a count per screen per day, never what you logged |

**You do not need an account to use this app.** Logging a workout has never
required one and never will. An account exists for one reason: so the same data
appears on a second device.

---

## What we collect, and why

### Data you enter

Workouts, sets, weights, reps, cardio sessions, plans, gyms and their equipment,
bodyweight, body-fat percentage, tape measurements and readiness check-ins.

All of it is stored locally on your device. The app reads every screen from that
local copy, which is why it works with no signal.

### Data from Health Connect (Android)

If you grant permission, the app **reads** sleep, steps, heart rate, bodyweight
and body-fat percentage from Health Connect, and **writes** completed workouts
back to it.

- Permission is asked for explicitly and can be revoked at any time in Android's
  Health Connect settings.
- Data read from Health Connect is stored on your device the same way data you
  typed is, and is used to inform readiness scoring and correlations.
- **We do not request access to health records** (`READ_HEALTH_DATA_IN_RECORDS`),
  and the app has no feature that would use them.

### Account data

If you create an account, we store your **email address** and an authentication
token. Passwords are handled by our authentication provider and are never stored
by us in a form we can read.

### Crash reports

If the app crashes or hits an error it could not handle, a report is sent to
**Sentry**, our crash-reporting provider, so we can find and fix it. A report
contains the error, the stack trace, and the app and device version.

- **No IP address and no user identifier is attached.** We have turned that off
  (`sendDefaultPii`), so a crash report is not linked to you or your account.
- **Network breadcrumbs are stripped of their contents**, so a crash that
  happened during a sync does not carry what was being synced.
- Your workouts, bodyweight, measurements and photos are never included.

### Usage counts — off unless you turn them on

You can choose to share **which screens you open**, under *Usage* in Settings.
It is **off by default** and nothing is recorded until you switch it on.

What is recorded is a **count per screen per day** — for example, "coach: 3
times on 29 August". That is the whole of it. Specifically:

- **Never what you logged.** No exercise names, no weights, no notes, no gym
  names. The list of screens that can be counted is fixed in the app's source
  and cannot include anything you typed.
- **Never *when*.** A count for a day is not a timestamp, so it cannot show what
  time you train or when you pick up your phone.
- **No third-party analytics, ever.** There is no analytics SDK in this app. The
  counts travel over the same sync that carries your training data, to the same
  place, and are read with a single query.

Settings shows you exactly what has been recorded on your device before any of
it is uploaded, and **Forget what has been recorded** deletes it.

We use this to answer one question — which features are worth building on — and
nothing else.

### Advertising

We do not collect advertising identifiers, and there is no advertising in the
app.

**We have never sold personal data and will not.** We do not share it with
advertisers or data brokers.

---

## What leaves your device

Nothing you have logged, unless one of these three things is true. Crash
reports are separate and are covered above — they carry no logged data.

### 1. You created an account (sync)

Your logged data is uploaded to our server so your other device — or your
partner, if you have linked accounts — can see it. Row-level security means one
account cannot read another's rows; this is enforced by the database, not by the
app.

**These sync:** workouts, sets, cardio sessions, plans, gyms, equipment,
exercise preferences, readiness check-ins, body metrics, goals, settings — and
the usage counts described above, but only if you switched them on.

**These never sync, by design:**

- **Progress photos.** The sync engine has no code path to them. They are the
  most sensitive thing the app holds and the only protection worth relying on is
  that the mechanism does not exist.
- Your device's authentication session.
- The local AI cost ledger.

### 2. You linked accounts with a partner

Partners share **plans, workouts and sets**. Partners do **not** share body
metrics, progress photos or AI spending. Either person can unlink at any time.

### 3. You used an AI feature

See below.

---

## Artificial intelligence

AI features are optional and are off unless you use them.

When you use one, the app sends a small **context** — training numbers relevant
to the question — to our server, which forwards it to **Anthropic** (our AI
provider) and returns the answer. Our server holds the API key so it is never in
the app.

**The context never contains:**

- Progress photos
- Your body measurements or body-fat percentage
- Your email address or any account identifier beyond what is needed to bill the
  request to your own budget

This is enforced in code at the point every request is built, not by
instructions in a prompt, and it is covered by automated tests that fail the
build if a restricted field is ever added to a request.

Anthropic processes these requests on our behalf. We do not use your data to
train any model, and our agreement with Anthropic does not permit them to either.

Every AI feature has a deterministic fallback. If you switch AI off, or have no
signal, or exceed the monthly budget, the app still answers — from the local
engine — and always tells you which answer you are looking at.

---

## Children

Steady Increment is not directed at children and we do not knowingly collect data
from anyone under 13 (or the equivalent minimum age in your jurisdiction).

---

## How long we keep it

Local data stays on your device until you delete it.

Synced data stays on our server until you delete it or close your account.

**Settings → Data → Reset everything** deletes both. It purges the server copy
*first* and refuses to run at all if it cannot reach the server, precisely so it
cannot leave you with a device wiped and a server copy waiting to come back.

Deleting the app removes all local data including progress photos. If you had an
account, use the reset above **before** uninstalling, or contact us, to remove
the server copy too.

---

## Your rights

Depending on where you live you may have the right to access, correct, export,
delete, or restrict processing of your personal data, and to object to it.

Two of these you can exercise without contacting anybody:

- **Export:** Profile → Export. Everything, as CSV.
- **Delete:** Settings → Data → Reset everything.

For anything else, or to have your account and its server data removed entirely,
email the address below. We will respond within 30 days.

If you are in the EEA or UK, the lawful basis for processing is **performance of
a contract** (providing the app you asked for) and, for the AI features and
Health Connect access, **your consent** — which you can withdraw at any time by
turning them off.

---

## Security

Data in transit is encrypted with TLS. Data on our server is encrypted at rest
and access is restricted by row-level security policies enforced by the database.
Data on your device is protected by your device's own encryption and app
sandboxing.

No system is perfectly secure. If we become aware of a breach affecting your
data, we will notify you and any required regulator without undue delay.

---

## Changes

If this policy changes materially, the app will say so before the change takes
effect rather than quietly updating a page nobody revisits.

---

## Contact

**Lonexa LLC**
support@lonexa.ai

<!--
  MAINTAINER NOTE - not published.

  Before this goes live, three things must be true and are not yet:

  1. `support@lonexa.ai` has to exist and be monitored. Play rejects a
     listing whose contact address bounces.
  2. The business address in the Play payments profile must match the D&B
     record. See TASKS.md > "Play Console account type".
  3. The Anthropic zero-retention / no-training claim above must be checked
     against the commercial terms in force at launch, not assumed. If the terms
     differ, this section changes - it is the one paragraph here making a
     promise about a third party.
-->
