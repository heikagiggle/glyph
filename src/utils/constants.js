
export const LEVEL_CONFIG = {
  easy: {
    label: "Easy",
    time: 10,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/40",
    steps: [2, 3, 4],
  },
  medium: {
    label: "Medium",
    time: 20,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/40",
    steps: [2, 3, 4],
  },
  hard: {
    label: "Hard",
    time: 30,
    color: "from-rose-500 to-red-600",
    shadow: "shadow-rose-500/40",
    steps: [3, 4, 5],
  },
};

export const JEWEL_COLORS = [
  {
    bg: "bg-blue-700",
    text: "text-blue-100",
    glow: "#1d4ed8",
    name: "Sapphire",
  },
  {
    bg: "bg-purple-700",
    text: "text-purple-100",
    glow: "#7e22ce",
    name: "Amethyst",
  },
  {
    bg: "bg-emerald-700",
    text: "text-emerald-100",
    glow: "#065f46",
    name: "Emerald",
  },
  { bg: "bg-rose-700", text: "text-rose-100", glow: "#9f1239", name: "Ruby" },
  {
    bg: "bg-amber-600",
    text: "text-amber-100",
    glow: "#92400e",
    name: "Topaz",
  },
  { bg: "bg-cyan-700", text: "text-cyan-100", glow: "#164e63", name: "Aqua" },
  {
    bg: "bg-fuchsia-700",
    text: "text-fuchsia-100",
    glow: "#86198f",
    name: "Tanzanite",
  },
  { bg: "bg-teal-700", text: "text-teal-100", glow: "#134e4a", name: "Jade" },
];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const getJewelColor = (i) => JEWEL_COLORS[i % JEWEL_COLORS.length];
