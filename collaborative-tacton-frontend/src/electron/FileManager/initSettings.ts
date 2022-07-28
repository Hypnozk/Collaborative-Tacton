import { KeyBoardButton } from '@/types/GeneralType';
import { v4 as uuidv4 } from 'uuid';


export const initSettings = {
    userName: "",
    buttons: [{
        i: uuidv4(),
        channels: [0],
        color: "#ff2d2d",
        h: 1,
        intensity: 1,
        key: "Z",
        w: 1,
        x: 5,
        y: 0,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [1, 2],
        color: "#07d248",
        h: 1,
        intensity: 1,
        key: "U",
        w: 1,
        x: 7,
        y: 1,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [3],
        color: "#ff2d2d",
        h: 1,
        intensity: 1,
        key: "K",
        w: 1,
        x: 8,
        y: 3,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [4, 5],
        color: "#07d248",
        h: 1,
        intensity: 1,
        key: "N",
        w: 1,
        x: 7,
        y: 5,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [6],
        color: "#ff2d2d",
        h: 1,
        intensity: 1,
        key: "B",
        w: 1,
        x: 5,
        y: 6,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [7, 8],
        color: "#07d248",
        h: 1,
        intensity: 1,
        key: "V",
        w: 1,
        x: 3,
        y: 5,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [9],
        color: "#ff2d2d",
        h: 1,
        intensity: 1,
        key: "F",
        w: 1,
        x: 2,
        y: 3,
        isActive: {
            mouse: false,
            keyboard: false
        }
    },
    {
        i: uuidv4(),
        channels: [10, 11],
        color: "#07d248",
        h: 1,
        intensity: 1,
        key: "T",
        w: 1,
        x: 3,
        y: 1,
        isActive: {
            mouse: false,
            keyboard: false
        }
    }]
}

export interface CustomSettings {
    userName: string,
    buttons: KeyBoardButton[]
}
