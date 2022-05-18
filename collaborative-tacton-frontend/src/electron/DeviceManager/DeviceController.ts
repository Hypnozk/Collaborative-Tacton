import { TactileTask } from "@/types/GeneralType";
import { Peripheral } from "@abandonware/noble";
import protobuf from "protobufjs";
import { tactileDisplayService } from "./Services";

enum InstructionType {
    channelId = "channelId",
    groupId = "groupId"
}

type payload = {
    [k in InstructionType]: number
} | {
    intensity: number
}

type Instruction = {
    setParameter: payload
}

const buildMessages = (instructions: Instruction[], definition: protobuf.Type) => {
    var messages: protobuf.Message[] = [];
    instructions.forEach((instruction: Instruction) => {
        const errMsg = definition.verify(instruction);
        if (errMsg) {
            console.log(errMsg);
            throw Error(errMsg);
        }
        messages.push(definition.create(instruction));
    });
    return messages;
}

const buildWriter = (messages: protobuf.Message[], instructionDef: protobuf.Type): Buffer => {
    var writer: any = null;
    messages.forEach((message: protobuf.Message) => {
        writer = instructionDef.encodeDelimited(message, writer);
    });
    return writer.finish();
}

const convertTaskToInstruction = (task: TactileTask, InstSetParamDef: protobuf.Type): Instruction[] => {
    const instructionList: Instruction[] = [];
    task.channel.forEach(channelId => {
        const instruction = {
            setParameter: {
                channelId: channelId,
                intensity: task.intensity
            }
        }
        var errMsg = InstSetParamDef.verify(instruction);
        if (errMsg) {
            throw Error(errMsg);
        }

        instructionList.push(instruction)
    })

    return instructionList
}

export const executeInstruction = (device: Peripheral, task: TactileTask) => {
    protobuf.load("src/protobuf/vtproto.proto", function (err, root) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (root == undefined)
            return;

        var InstSetParamDef = root.lookupType("InstInstantlySetParameter");
        var instructionDef = root.lookupType("Instruction");

        //console.log("services: " + device.services.length)
        const service = device.services.find((x) => x.uuid === tactileDisplayService.service.uuid)

        if (service !== undefined) {
            const characteristic = service.characteristics.find((characteristic) => characteristic.uuid === tactileDisplayService.characteristics.vtprotoBuffer.uuid);
            if (characteristic !== undefined) {
                const instructions: Instruction[] = convertTaskToInstruction(task, InstSetParamDef)
                const messages = buildMessages(instructions, instructionDef);
                //
                const buffer = buildWriter(messages, instructionDef);
                characteristic.write(buffer, true, (error) => {
                    //go always in this callback if error is null;all is fine
                    if (error !== null)
                        throw error;
                });
            }
        }
    });

}