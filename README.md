# Sales Persona Trainer

Expo (React Native, TypeScript) client for the trainer at [sales-persona.vercel.app](https://sales-persona.vercel.app). It is scaffolding: screen shells, a plain sitting flow, and folders for later phases. It uses Expo SDK 57 so it opens in the current Expo Go app (Expo Go 57 from the App Store and Play Store). No custom native modules.

## Run in Expo Go

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on Android, or with the camera on iPhone, then open it in Expo Go. Phone and computer need the same network. If they do not, press `s` in the terminal to switch Expo to tunnel mode.

On iOS, current Expo Go asks you to be signed in on both the phone and the terminal before a development server will load. Create a free account at [expo.dev/signup](https://expo.dev/signup), then run `npx expo login` and sign in inside Expo Go with the same account.

## Environment

| Name | Required | Default |
| --- | --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | No | `https://sales-persona.vercel.app` |

Copy `.env.example` to `.env` only if you want a different backend. Restart `npx expo start` after changing it. Expo inlines `EXPO_PUBLIC_` values when it builds the bundle.

Name, difficulty, and light or dark mode are stored on the device with AsyncStorage.

## Checks

```bash
npm run typecheck
npm run lint
npm test
```

## Share an Expo Go demo with EAS Update

No Expo account is set up for this repo yet. The published runtime must be `exposdk:57.0.0`, which is what Expo Go 57 loads. `app.json` sets `runtimeVersion.policy` to `sdkVersion` so the update matches.

1. Create an account at [expo.dev/signup](https://expo.dev/signup).
2. Install the CLI and sign in:

```bash
npm install --global eas-cli
eas login
```

3. Create the Expo project. This writes `extra.eas.projectId` into `app.json`:

```bash
eas init
```

4. Turn on EAS Update. This adds `updates.url`. If the command replaces `runtimeVersion`, put this back so Expo Go can load the bundle:

```json
"runtimeVersion": { "policy": "sdkVersion" }
```

```bash
eas update:configure
```

5. The live API is the default, so you can skip an environment variable. To point the published demo at another backend:

```bash
eas env:create --name EXPO_PUBLIC_API_BASE_URL --value https://sales-persona.vercel.app --environment preview --visibility plaintext
```

6. Publish:

```bash
eas update --channel preview --message "Sales Persona Trainer demo" --environment preview
```

7. Open it in Expo Go. Replace `PROJECT_ID` with `expo.extra.eas.projectId` from `app.json`.

QR image:

```text
https://qr.expo.dev/eas-update?projectId=PROJECT_ID&runtimeVersion=exposdk:57.0.0&channel=preview
```

The same link as a URL (scan it, or paste it into Expo Go):

```text
exp://u.expo.dev/PROJECT_ID?runtime-version=exposdk:57.0.0&channel-name=preview
```

Add `&format=url` on the qr.expo.dev link if you want the plain URL as text. `eas update` also prints a dashboard link for the update group.

If the phone’s Expo Go has moved on to a newer SDK, it will refuse this project until `expo` is upgraded to that SDK.

## Layout

- `app/` — Expo Router. Tabs: Train, History, Analytics, Board, Settings. Sitting is `app/session/[id].tsx`.
- `src/api/` — plain HTTP to the live tRPC routes (`/api/trpc/...`), with superjson decoding.
- `src/theme/tokens.ts` — light and dark colours.
- `src/offer/` — the Counterline offer the home screen reads. Swap this when the catalogue exists.
- `src/future/catalogue.ts` — apps, websites, pages, and services. Not built.
- `src/future/build-theatre.ts` — post-close build theatre. Not built.
- `src/future/pricing.ts` — quote lines in pence. Not built.

The backend is unchanged. Objections, scores, and coaching come from the live API.
