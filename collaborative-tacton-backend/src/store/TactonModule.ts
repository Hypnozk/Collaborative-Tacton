import { ClientInstrution, TactonInstruction } from "../types";

let tactonInstructionList: Map<string, { lastModified: number, tacton: TactonInstruction[] }> = new Map<string, { lastModified: number, tacton: TactonInstruction[] }>();

const createRoomRef = (roomId: string) => {
    tactonInstructionList.set(roomId, { lastModified: new Date().getTime(), tacton: [] });
}

const removeRoomRef = (roomId: string) => {
    tactonInstructionList.delete(roomId);
}

const addTactonInstruction = (roomId: string, clientInstrution: ClientInstrution[]) => {
    const currentList = tactonInstructionList.get(roomId)
    if (currentList == undefined) return;

    const instructionList: TactonInstruction[] = currentList.tacton;
    if (currentList.tacton.length > 0) {
        const timeDiff = new Date().getTime() - currentList.lastModified;
        const parameter = {
            Instruction: {
                wait: {
                    miliseconds: timeDiff
                }
            }
        }
        instructionList.push(parameter)
    }
    clientInstrution.forEach(clInstruct => {
        const parameter = {
            Instruction: {
                setParameter: {
                    channelId: clInstruct.channelId,
                    intensity: clInstruct.intensity
                }
            }
        }
        instructionList.push(parameter)
    });

    tactonInstructionList.set(roomId, { lastModified: new Date().getTime(), tacton: instructionList });
}

const deleteTactonInstructions = (roomId: string) => {
    tactonInstructionList.set(roomId, { lastModified: new Date().getTime(), tacton: [] })
}

const getTacton = (roomId: string) => {
    const tactonInstruction  = tactonInstructionList.get(roomId);
    if(tactonInstruction == undefined) return;
    return tactonInstruction.tacton
}

export default {
    createRoomRef,
    removeRoomRef,
    addTactonInstruction,
    deleteTactonInstructions,
    getTacton
}