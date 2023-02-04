type User = {
  username: string;
  password: string;
};

type LocalStorageUser = {
  id: string | undefined;
  token: string | undefined;
};

export type { User, LocalStorageUser };
