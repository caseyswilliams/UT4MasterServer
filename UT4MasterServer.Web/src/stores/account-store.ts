import { TypedStorage } from "../utils/typed-storage";
import { ref } from "vue";
import { IAccount } from "../types/account";
import AccountService from "../services/account.service";
import { SessionStore } from "./session-store";

const _account = ref<IAccount | null>(TypedStorage.getItem<IAccount>('account'));
const _accounts = ref<IAccount[] | null>(TypedStorage.getItem<IAccount[]>('accounts'));
const _accountService = new AccountService();

export const AccountStore = {
    get account() {
        return _account.value;
    },
    set account(account: IAccount | null) {
        _account.value = account;
        TypedStorage.setItem<IAccount>('account', account);
    },
    get accounts() {
        return _accounts.value;
    },
    set accounts(accounts: IAccount[] | null) {
        _accounts.value = accounts;
        TypedStorage.setItem<IAccount[]>('accounts', accounts);
    },
    async fetchUserAccount() {
        try {
            _account.value = SessionStore.session?.account_id ? await _accountService.getAccount(SessionStore.session.account_id) : null;
        }
        catch (err: unknown) {
            console.error('Error fetching user account:', err);
        }
    },
    async fetchAllAccounts() {
        try {
            _accounts.value = await _accountService.getAllAccounts();
        }
        catch (err: unknown) {
            console.error('Error fetching all accounts:', err);
        }
    }
};
