import { Slot } from "expo-router";
import { Header } from "~/components/layouts/default/Header";

export default function CommonLayout() {
	return (
		<>
			<Header />
			<Slot />
		</>
	);
}
