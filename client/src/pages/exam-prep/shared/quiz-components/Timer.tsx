import React, { useEffect, useState } from "react";
export default function Timer({ seconds, onExpire }: { seconds: number;
onExpire?: () => void }) {
const [time, setTime] = useState(seconds);
useEffect(() => {
if (time <= 0) {
onExpire && onExpire();
return;
}
const t = setInterval(() => setTime((s) => s - 1), 1000);
return () => clearInterval(t);
}, [time, onExpire]);
const minutes = Math.floor(time / 60);
const secs = time % 60;
return <div className="font-mono text-sm">{minutes}:
{secs.toString().padStart(2, "0")}</div>;
}