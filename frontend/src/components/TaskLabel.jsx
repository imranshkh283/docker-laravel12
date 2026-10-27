import { labelColors, defaultLabelColor } from "../constants/labelColors";

export default function TaskLabel({ label }) {
    const colors = labelColors[label] ?? defaultLabelColor;
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    return (
        <span
            style={{
                color: colors.color,
                backgroundColor: colors.backgroundColor,
                padding: "4px 10px",
                borderRadius: "6px",
                fontWeight: 600,
            }}
        >
            {formattedLabel}
        </span>
    );
}
