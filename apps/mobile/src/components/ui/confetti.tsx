import { Confetti } from "react-native-fast-confetti";

export default function ConfettiBase() {
	return (
		<Confetti
			colors={[
				"#FF6B6B",
				"#4ECDC4",
				"#45B7D1",
				"#96CEB4",
				"#FFEAA7",
				"#DDA0DD",
			]}
			isInfinite={false}
		/>
	);
}
