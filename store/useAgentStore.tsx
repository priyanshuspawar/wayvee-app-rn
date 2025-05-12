import { create } from 'zustand';

import { Stay } from '~/utils/responseTypes';

interface AgentStore {
  myStays: Stay[];
  setStays: (stays: Stay[]) => void;
}

const useAgentStore = create<AgentStore>((set) => ({
  myStays: [],
  setStays: (stays) =>
    set({
      myStays: stays,
    }),
}));

export default useAgentStore;
