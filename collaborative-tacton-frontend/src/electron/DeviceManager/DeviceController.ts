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

export const executeInstruction = (device:Peripheral, task: TactileTask) => {
    protobuf.load("src/protobuf/vtproto.proto", function (err, root) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (root == undefined)
            return;

        var InstSetParamDef = root.lookup("InstInstantlySetParameter");
        var instructionDef = root.lookupType("Instruction");

        console.log("task");
        console.log(task);
        console.log("services: " + device.services.length)
        //console.log(connectedDevice.services)
        const service = device.services.find((x) => x.uuid === tactileDisplayService.service.uuid)

        if (service !== undefined) {
            const characteristic = service.characteristics.find((characteristic) => characteristic.uuid === tactileDisplayService.characteristics.vtprotoBuffer.uuid);
            if (characteristic !== undefined) {
                const instructions: Instruction[] = [{ setParameter: { channelId: 0, intensity: 1 } },
                { setParameter: { channelId: 1, intensity: 1 } },
                { setParameter: { channelId: 2, intensity: 1 } },
                { setParameter: { channelId: 3, intensity: 1 } }]
                const messages = buildMessages(instructions, instructionDef);
                //
                const buffer = buildWriter(messages, instructionDef);
                console.log("buffer")
                console.log(buffer)
                console.log("messages")
                console.log(messages)
                characteristic.write(buffer, true, (error) => {
                    //go always in this callback if error is null;all is fine
                    console.log("error " + characteristic);
                    console.log(error);
                });
            }
        }
        console.log("connectedDevice?.services")
        //console.log(connectedDevice.services)

    });

}