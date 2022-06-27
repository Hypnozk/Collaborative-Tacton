import { v4 as uuidv4 } from 'uuid';


export const initSettings = {
    userName: "",
    buttons: [{
        i: uuidv4(),
        channels: [0],
        color: "#65FF00",
        h: 1,
        intensity: 1,
        key: "Z",
        w: 1,
        x: 5,
        y: 0,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [1],
        color: "#FF0014",
        h: 1,
        intensity: 1,
        key: "U",
        w: 1,
        x: 7,
        y: 1,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [2],
        color: "#65FF00",
        h: 1,
        intensity: 1,
        key: "K",
        w: 1,
        x: 8,
        y: 3,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [3],
        color: "#FF0014",
        h: 1,
        intensity: 1,
        key: "N",
        w: 1,
        x: 7,
        y: 5,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [4],
        color: "#65FF00",
        h: 1,
        intensity: 1,
        key: "B",
        w: 1,
        x: 5,
        y: 6,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [5],
        color: "#FF0014",
        h: 1,
        intensity: 1,
        key: "V",
        w: 1,
        x: 3,
        y: 5,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [6],
        color: "#65FF00",
        h: 1,
        intensity: 1,
        key: "F",
        w: 1,
        x: 2,
        y: 3,
        isActive: false
    },
    {
        i: uuidv4(),
        channels: [7],
        color: "#FF0014",
        h: 1,
        intensity: 1,
        key: "T",
        w: 1,
        x: 3,
        y: 1,
        isActive: false
    }]
}