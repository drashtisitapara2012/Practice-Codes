import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { Expense } from "../types/expense";

interface ExpenseChartProps {
  expenses: Expense[];
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const labels = expenses.map(e => e.category);
  const data = expenses.map(e => e.amount);
  const backgroundColor = generateColors(labels.length);

  function generateColors(count: number) {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i); // Spread across the hue
      colors.push(`hsl(${hue}, 50%, 50%)`);
    }
    return colors;
  }

  const getCategoryData = (list: Expense[]) => {
    const totals: Record<string, number> = {};
    list.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return {
      labels: Object.keys(totals),
      data: Object.values(totals),
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { labels, data } = getCategoryData(expenses);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvas, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor
          }
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      },
    });
  }, [expenses]);

  return <canvas ref={canvasRef} id="categoryChart"></canvas>;
}
