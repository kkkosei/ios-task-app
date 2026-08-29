# Calendar Tasks

iOSカレンダーの予定とタスクを紐づけて管理するExpoアプリです。

## 開発

```bash
npm install
npx expo run:ios
```

`expo-calendar`はExpo Goでは利用できないため、カレンダー連携の確認にはdevelopment buildを使用してください。

## チェック

```bash
npx tsc --noEmit
npx expo export --platform web
```
