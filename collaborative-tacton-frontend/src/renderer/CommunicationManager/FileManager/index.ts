import { mutations, MutationTypes, PlayGroundActionTypes } from "@/renderer/store/modules/playGround/playGround";
import { KeyBoardButton } from "@/types/GeneralType";
import { useStore } from "../../store/store";
import { v4 as uuidv4 } from 'uuid';

const store = useStore()

export const initConfig = () => {
    const buttons: KeyBoardButton[] = [{
        channels: [1],
        color: "#0693E3",
        h: 1,
        i: uuidv4(),
        intensity: 1,
        key: "A",
        w: 1,
        x: 1,
        y: 1,
        isActive: false
    }]



    console.log(buttons)
    store.commit(MutationTypes.BULK_GRID_UPDATE, buttons)
}