import React from "react";
import { Button, Dropdown } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogout, userUpdateId } from "../redux/slices/userSlice";
import { core } from "@dsnp/sdk";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import * as sdk from "../services/sdk";
import * as wallet from "../services/wallets/wallet";
import * as session from "../services/session";
import LoginButton from "./LoginButton";
import RegistrationModal from "./RegistrationModal";
import UserAvatar from "./UserAvatar";

interface LoginProps {
  loginWalletOptions: wallet.WalletType;
}

const Login = ({ loginWalletOptions }: LoginProps): JSX.Element => {
  const [loading, startLoading] = React.useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [registrationVisible, setRegistrationVisible] = React.useState<boolean>(
    false
  );

  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);
  const currentWalletType = useAppSelector((state) => state.user.walletType);

  const setUserID = (fromURI: string) => {
    const fromId = core.identifiers.convertDSNPUserURIToDSNPUserId(fromURI);
    dispatch(userUpdateId(fromId));
    session.upsertSessionUserId(fromId);
    setRegistrationVisible(false);
  };

  const login = async (selectedType: wallet.WalletType) => {
    if (loading) return;
    startLoading(true);
    try {
      const waddr = await wallet.wallet(selectedType).login();
      setWalletAddress(waddr);
      sdk.setupProvider(selectedType);
      const registrations = await sdk.getSocialIdentities(waddr);
      if (registrations.length === 1) {
        setUserID(registrations[0].dsnpUserURI);
      } else {
        setRegistrations(registrations);
        setRegistrationVisible(true);
      }
    } catch (error) {
      logout();
    } finally {
      setPopoverVisible(false);
      startLoading(false);
    }
  };

  const handle = "neverenough";
  const profileName = "Bob";
  const avatar =
    "https://i.pinimg.com/564x/c7/45/de/c745deb0177e4584d2d6e1ff11ae8c7c.jpg";

  const logout = () => {
    session.clearSession();
    setRegistrationVisible(false);
    setWalletAddress("");
    if (currentWalletType !== wallet.WalletType.NONE) {
      wallet.wallet(currentWalletType).logout();
    }
    dispatch(userLogout());
  };

  return (
    <div className="Login__block">
      {!userId ? (
        <RegistrationModal
          visible={registrationVisible}
          registrations={registrations}
          onIdResolved={setUserID}
          walletAddress={walletAddress}
        >
          <LoginButton
            popoverVisible={popoverVisible}
            setPopoverVisible={setPopoverVisible}
            loginWalletOptions={loginWalletOptions}
            loading={loading}
            loginWithWalletType={login}
          />
        </RegistrationModal>
      ) : (
        <>
          <Dropdown
            overlay={
              <>
                <Button
                  className="Login__logOutButton"
                  aria-label="Logout"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </>
            }
            placement="bottomRight"
          >
            <Button className="Login__avatarButton">
              <UserAvatar
                avatarSize="medium"
                profileAddress={userId}
                avatarUrl={avatar}
              />
            </Button>
          </Dropdown>
          <div className="Login__profileInfo">
            <div className="Login__handle">@{handle}</div>
            <div className="Login__profileName">{profileName}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
