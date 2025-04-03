// needs.tsx
const a = {
  "meditation_api_url": "https://3826-34-168-254-170.ngrok-free.app",
  "conflict_ws_url": "wss://3826-34-168-254-170.ngrok-free.app/ws/conflict/"
};

export default function getData(tof: string): string {
  return tof === "api" ? a.meditation_api_url : a.conflict_ws_url;
}