import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ACCENT = "#9100FF";

interface ChartDataItem {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export function ProgressBarChart({ 
  data, 
  title, 
  subtitle 
}: { 
  data: ChartDataItem[]; 
  title: string; 
  subtitle?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconWrap}>
            <Feather name="bar-chart-2" size={18} color={ACCENT} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const barWidth = (item.value / maxValue) * 100;
          const percentage = maxValue > 0 ? Math.round((item.value / maxValue) * 100) : 0;

          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barLabelWrapper}>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.barValue}>{item.value}</Text>
              </View>

              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: item.color || ACCENT,
                    },
                  ]}
                />
              </View>

              <View style={styles.percentageWrapper}>
                <Text style={styles.percentage}>{percentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface WeeklyData {
  day: string;
  cardsStudied: number;
  cardsReviewed: number;
}

export function WeeklyProgressChart({ 
  dailyData 
}: { 
  dailyData: WeeklyData[] 
}) {
  const maxValue = Math.max(
    ...dailyData.map((d) => Math.max(d.cardsStudied, d.cardsReviewed)), 
    1
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconWrap}>
            <Feather name="calendar" size={18} color={ACCENT} />
          </View>
          <View>
            <Text style={styles.title}>Progres 7 Hari Terakhir</Text>
            <Text style={styles.subtitle}>Jumlah kartu yang dipelajari per hari</Text>
          </View>
        </View>
      </View>

      <View style={styles.weeklyChartContainer}>
        {dailyData.map((item, index) => {
          const studiedHeight = (item.cardsStudied / maxValue) * 100;
          const reviewedHeight = (item.cardsReviewed / maxValue) * 100;

          return (
            <View key={index} style={styles.weeklyBarWrapper}>
              <View style={styles.weeklyBarTrack}>
                {item.cardsStudied > 0 && (
                  <View
                    style={[
                      styles.weeklyBarFill,
                      styles.studiedBar,
                      { height: `${studiedHeight}%` },
                    ]}
                  />
                )}
                {item.cardsReviewed > 0 && (
                  <View
                    style={[
                      styles.weeklyBarFill,
                      styles.reviewedBar,
                      { height: `${reviewedHeight}%` },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.weeklyDayLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.weeklyLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: ACCENT }]} />
          <Text style={styles.legendText}>Dipelajari</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
          <Text style={styles.legendText}>Direview</Text>
        </View>
      </View>
    </View>
  );
}

interface MasteryData {
  newCards: number;
  learning: number;
  review: number;
  mastered: number;
}

export function MasteryChart({ 
  newCards, 
  learning, 
  review, 
  mastered 
}: MasteryData) {
  const total = newCards + learning + review + mastered;
  const maxValue = total || 1;

  const items = [
    { label: "Baru", value: newCards, color: "#6B7280" },
    { label: "Belajar", value: learning, color: "#F59E0B" },
    { label: "Review", value: review, color: ACCENT },
    { label: "Kuasai", value: mastered, color: "#10B981" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconWrap}>
            <Feather name="pie-chart" size={18} color={ACCENT} />
          </View>
          <View>
            <Text style={styles.title}>Tingkat Penguasaan</Text>
            <Text style={styles.subtitle}>Distribusi kartu berdasarkan status</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {items.map((item, index) => {
          const percentage = Math.round((item.value / maxValue) * 100);

          return (
            <View key={index} style={styles.masteryBarWrapper}>
              <View style={styles.masteryLabelRow}>
                <Text style={styles.masteryLabel}>{item.label}</Text>
                <Text style={styles.masteryCount}>
                  {item.value} ({percentage}%)
                </Text>
              </View>
              <View style={styles.masteryTrack}>
                <View
                  style={[
                    styles.masteryFill,
                    { width: `${percentage}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#111827",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  chartContainer: {
    gap: 12,
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barLabelWrapper: {
    width: 70,
  },
  barLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#374151",
  },
  barValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: "#6B7280",
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
  percentageWrapper: {
    width: 40,
    alignItems: "flex-end",
  },
  percentage: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#111827",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(17,24,39,0.06)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#6B7280",
  },
  weeklyChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingVertical: 10,
  },
  weeklyBarWrapper: {
    alignItems: "center",
    flex: 1,
  },
  weeklyBarTrack: {
    width: 24,
    height: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "column-reverse",
    justifyContent: "flex-start",
  },
  weeklyBarFill: {
    width: "100%",
    borderRadius: 6,
  },
  studiedBar: {
    backgroundColor: ACCENT,
  },
  reviewedBar: {
    backgroundColor: "#10B981",
  },
  weeklyDayLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 8,
  },
  weeklyLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(17,24,39,0.06)",
  },
  masteryBarWrapper: {
    gap: 6,
  },
  masteryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  masteryLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#374151",
  },
  masteryCount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#111827",
  },
  masteryTrack: {
    height: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    overflow: "hidden",
  },
  masteryFill: {
    height: "100%",
    borderRadius: 6,
  },
});

