import React, { useCallback, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useBackgroundSelector } from '../App/hooks';
import { InitializeKeyring } from '../App/pages/keyring';
import {
  ProtectedRouteHasAccounts,
  ProtectedRouteKeyringUnlocked,
} from '../App/protected-route';
import { getAddressCount } from '../Background/redux-slices/selectors/accountSelectors';
import DappPermission from './pages/dapp-permission';
import Home from './pages/home';

const Popup = () => {
  const hasAccounts = useBackgroundSelector(
    (state) => getAddressCount(state) > 0
  );

  const openExpandedView = useCallback(() => {
    const url = chrome.runtime.getURL('app.html');
    chrome.tabs.create({
      url,
    });
  }, []);

  useEffect(() => {
    if (!hasAccounts) {
      openExpandedView();
    }
  }, [hasAccounts, openExpandedView]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRouteHasAccounts>
            <ProtectedRouteKeyringUnlocked>
              <Home />
            </ProtectedRouteKeyringUnlocked>
          </ProtectedRouteHasAccounts>
        }
      />
      <Route
        path="/dapp-permission"
        element={
          <ProtectedRouteHasAccounts>
            <DappPermission />
          </ProtectedRouteHasAccounts>
        }
      />
    </Routes>
  );
};

export default Popup;