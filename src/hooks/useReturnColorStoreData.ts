import { type ColorDataStoreType, colorDataStore } from "../store/projectStore";
import { useShallow } from "zustand/shallow"
export const useReturnColorStoreData =()=>{
            return colorDataStore(
            useShallow((state: ColorDataStoreType) => ({
                allInfo: state.allInfo,
                loading: state.loading,
                color: state.color,
                isDisabled: state.isDisabled,
                debouncedValue: state.debouncedValue,
                setColor: state.setColor,
                setAllInfo: state.setAllInfo,
                setIsDisabled: state.setIsDisabled,
                setDebouncedValue: state.setDebouncedValue,
                setLoadingProgress: state.setLoadingProgress,
                setLoading: state.setLoading,
                setErrorMessage: state.setErrorMessage
            }))
        );

}