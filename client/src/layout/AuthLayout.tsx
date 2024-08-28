import { ReactNode } from "react";
interface AuthLayoutProps {
  childers: ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ childers }) => {
  return (
    <div>
      <div className="text-4xl text-center p-10">Logo</div>
      {childers}
    </div>
  );
};

export default AuthLayout;
