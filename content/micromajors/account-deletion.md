# Deleting your MicroMajors account

**Last updated: 7 September 2026**

MicroMajors, by Lonexa LLC. You can delete your account at any time, from inside
the game, and you do not need to ask us to do it.

---

## The short version

| | |
|---|---|
| **What deletes your account** | **Dugout → Settings → Delete this account**, inside the game |
| **How long it takes** | Immediately. It is not a request queue |
| **What is removed** | Your account, your players, your tickets, everything you bought, and everything you trained |
| **What is kept** | Your teams, retired — renamed to a number, owned by nobody. Explained below |
| **Can it be undone** | No |

---

## Deleting from inside the game

- Open **Dugout → Settings**.
- Scroll to **Delete this account**.
- Read what it says will happen, type **DELETE** to confirm, and tap **Delete my
  account**.

It happens in one step and you are signed out. There is nothing to wait for.

You are asked to type the word because this is the only thing in the game that
cannot be undone. It is not there to discourage you.

## If you no longer have the game installed

Email **support@lonexa.ai** from the address your account uses, and ask us to
delete it. We will confirm by replying to that address, and we complete these
within **30 days** — in practice, much sooner.

We can only act on a request from the account's own email address. That is not
bureaucracy: acting on a request from anybody else would let a stranger delete
somebody's team.

---

## What is deleted

Everything we hold that belongs to you:

- Your account and your sign-in details
- Every player on every roster, including everything they had trained
- Your lineups, your training plans and any session that was running
- Your ticket balance, and the full history of what you earned and spent
- Everything you had bought — cosmetics, stadiums, and the Deluxe Trainer if you
  owned it. **Purchases are not refunded and do not carry to a new account**
- Any league application you had made
- Your username and display name, which are released for somebody else to take

This is a real deletion and not a flag. Every one of those records is removed by
the database as a direct consequence of the account being removed, so there is no
list for us to forget an item from.

---

## What is kept, and why

### Your teams, retired

**Your team's row survives, renamed to its founding number and owned by nobody.**
It is the one thing that does, and it is deliberate.

**That is not us keeping something of yours.** Every game your team played is
also in your opponent's match history and in their box scores. Deleting the team
would take those games out of *their* record too — a stranger's history would
change because you left, and a season somebody else played would stop adding up.

So the team stops being yours. Its name goes, replaced by the number it was
founded with. Nobody owns it, nobody can train it or play it, and it earns
nothing.

### Fixtures already scheduled still play out

If your team was in a league season when you deleted your account, **its
remaining fixtures are played**. A division with an unplayable game in it
punishes eight people who did nothing, so a retired team plays out its schedule
and is gone at the season boundary.

It can even win one of those games. Nothing is credited to anybody when it does,
because there is no longer an owner to pay.

### The record that a purchase happened

If you had bought anything, the receipt row is kept **with your account reference
removed**. What is left records that a purchase of a particular product occurred
at a particular time, and cannot be linked back to you or to anybody else.

We keep it because it is how we reconcile against the store's own record. Google
Play holds the billing record itself, and both of us are required to keep
transaction records for tax purposes. Refunds are handled through Google Play.

---

## Anything sent to the AI

MicroMajors sends the summary of a finished game — the score, the line score and
the plays that mattered — to Anthropic, our AI provider, to write the recap. That
summary carries no account identifier and nothing that identifies you.

Those requests are not used to train any model and are not retained beyond the
processing of the request, and there is no separate AI account to delete. **The
record of what those requests cost us is deleted with your account**, along with
everything else.

---

## What is on your phone

MicroMajors keeps a local copy of your team so the game opens without waiting. It
is a cache of what is on our server, not a second copy of your account.

Deleting your account signs you out and the cache is cleared. Uninstalling the
game removes it too. **Uninstalling on its own does not delete your account** —
your team, your players and your tickets would all still be on our server, and
signing in again would bring them straight back. If you want it gone, delete the
account.

---

## Questions

**support@lonexa.ai**

Lonexa LLC

<!--
  MAINTAINER NOTE - not published.

  Checked against supabase/migrations/0017_account_deletion.sql on 2026-09-07,
  not written from memory. The behaviour claimed here is:

  - `teams.owner_id` is `on delete set null` (0017:104), `deleted_at` is set,
    `name` becomes 'Team #' || team_number, `applied` is cleared, and `tier` is
    deliberately NOT cleared so the team plays out its fixtures.
  - Running and queued `training_assignments` become `cancelled`.
  - `profiles.username` and `.display_name` are nulled before the cascade, so the
    username is released in the same transaction.
  - `delete from auth.users` cascades everything else. `iap_receipts.user_id` is
    the one `on delete set null` among them (0006:196) - that is the receipt row
    described above. `ai_usage.user_id` is `on delete cascade` (0007:55), so the
    AI cost ledger IS deleted here, unlike Steady Increment's, where it is
    anonymised and kept. Do not copy that app's wording over this.

  ONE KNOWN HOLE, and it is not a user-facing one: `admin_audit.actor_id` is
  `on delete restrict` (0011:28), so `delete_account` will RAISE for any account
  that has ever performed an admin action rather than deleting it. That is
  Justin's own account and any future staff account, never a player's. It should
  be fixed - set null and keep the audit row, which is what an audit log is for -
  but it does not make anything on this page wrong.

  If a future change makes anything else survive an account deletion, it belongs
  in "What is kept, and why" the same day. Google Play reads this page.
-->
