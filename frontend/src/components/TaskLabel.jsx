import { labelColors, defaultLabelColor } from "../constants/labelColors";

export default function TaskLabel({ label }) {
    const colors = labelColors[label] ?? defaultLabelColor;

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
            {label}
        </span>
    );
}
