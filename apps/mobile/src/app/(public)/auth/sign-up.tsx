import { Header } from "~/components/header";
import { Screen } from "~/components/screen";
import { SignUpContainer } from "~/containers/auth/sign-up.container";

export default function SignUp() {
  return (
    <Screen>
      <Header />
      <SignUpContainer />
    </Screen>
  );
}
