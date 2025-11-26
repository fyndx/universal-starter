import { FontAwesome } from "@expo/vector-icons";
import { remapProps } from "nativewind";
import { BottomSheetModal } from "~/components/ui/bottom-sheet";

remapProps(BottomSheetModal, {
  className: "style",
  handleClassName: "handleStyle",
  containerClassName: "containerStyle",
});

remapProps(FontAwesome, {
  className: "style",
  color: "color",
});
