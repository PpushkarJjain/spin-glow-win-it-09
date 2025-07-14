import React from "react";
import { Coins, Gift, Percent } from "lucide-react";

export interface Offer {
  id: number;
  label: string;
  maxPerRound: number;
  color: string;
  icon: React.ReactNode;
}

export const offerConfig: Offer[] = [
  { id: 1, label: "0.50g Silver Coin", maxPerRound: 25, color: "rgb(220, 38, 38)", icon: <Coins className="w-4 h-4" /> },
  { id: 2, label: "1g Silver Coin", maxPerRound: 20, color: "rgb(5, 150, 105)", icon: <Coins className="w-4 h-4" /> },
  { id: 3, label: "2g Silver Coin", maxPerRound: 15, color: "rgb(234, 88, 12)", icon: <Coins className="w-4 h-4" /> },
  { id: 4, label: "5g Silver Coin", maxPerRound: 5, color: "rgb(30, 64, 175)", icon: <Coins className="w-4 h-4" /> },
  { id: 5, label: "Service upto 200rs", maxPerRound: 15, color: "rgb(124, 58, 237)", icon: <Gift className="w-4 h-4" /> },
  { id: 6, label: "5% Flat off", maxPerRound: 15, color: "rgb(220, 38, 38)", icon: <Percent className="w-4 h-4" /> },
  { id: 7, label: "10% Flat off", maxPerRound: 3, color: "rgb(5, 150, 105)", icon: <Percent className="w-4 h-4" /> },
  { id: 8, label: "12% Flat off", maxPerRound: 2, color: "rgb(30, 64, 175)", icon: <Percent className="w-4 h-4" /> },
];
