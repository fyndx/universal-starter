import { remapProps } from "nativewind";
import { BottomSheetModal } from "~/components/ui/bottom-sheet";

remapProps(BottomSheetModal, {
	className: "style",
	handleClassName: "handleStyle",
	containerClassName: "containerStyle",
});
