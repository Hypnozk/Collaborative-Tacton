# vtproto
A data format for Vibrotactile Patterns based on Protocol Buffers

## Status
This specification is in DRAFT status.

## Summary
This specification defines messages
for [Protocol Buffers](https://developers.google.com/protocol-buffers)
to represent and transfer vibrotactile patterns, as well as a simple format for
storing these messages in a file.

## Features and Limits
This format allows the encodings of vibrotactile patterns with

- up to 4.294.967.296 (= 65.536 x 65.536) actuators / channels
- up to 4.294.967.295 actuator / channel groups
- up to ~1193 hours of pattern duration
- practically unlimited frequency spectrum (0Hz - 4.29GHz)
- 32bit floating point precision for intensity values
- custom string headers
- linear interpolation of frequency and intensity
- sine, square, triangle and sawtooth waves

## Basic Concepts
A vibrotactile pattern described by this format consists of a **stream of
instructions** that describe to a **hypothetical vibrotactile display** how to
control its actuators.

Each **actuator** has its own so-called **Channel ID**, with which it can be
addressed.

**Channels** can be grouped into **Channel Groups**, again each having its own
**Channel Group ID** which can be used to efficiently address multiple actuators
at once. For the avoidance of doubt, Channel IDs and Channel Group IDs cannot
overlap with one another. In other words, if there is a channel with ID 123
and a channel group with ID 123 at the same time, it is possible to address both
of them independently. **Group ID 0** is reserved for the special group
"all channels".

This format can control the parameters **Waveform**, **Intensity**
and **Frequency** of each actuator. You can either set these values with
immediate effect or alternatively, for Intensity and Frequency,
**linearly interpolate** between two values over a choosable amount of time.

**Intensity** is represented as a 32Bit floating point relative intensity value
in the range from 0.0 - 1.0.

Regarding **time**, instructions are to be interpreted as having immediate
effect, with the `WAIT` instruction as an exception, specifying that the
following instruction should be executed only after waiting for a choosable
amount of time.

Implementers MUST treat non-`WAIT` instructions as if they were all executed at
exactly the same time. In effect, this means that the actual time taken to
process the instructions preceding it MUST be taken into account when processing
a `WAIT` instruction.

In case of **collisions** (for example when a parameter change or another
interpolation is instructed, while an earlier interpolation is still
in progress), later instructions take priority over earlier instructions.
For the avoidance of doubt, these later instructions continue to operate on the
latest available state of the display; the display's or actuator's state
MUST NOT be reset to a state before the invocation of the interrupted
instruction.

## Specification of Messages (.proto file)
The specification of the messages for representing and transferring vibrotactile
patterns can be found in the file [vtproto.proto](./vtproto.proto)

A transmission or file conforming to this specification always begins with
a `FileHeader` message, followed by an arbitrary number of `Instruction`
messages.

## Specification of File Storage Format
Since Protocol Buffers is neither self-describing nor self-delimiting, in order
to store vibrotactile patterns described using messages specified above,
a length indicator (a standard Protocol Buffers varint) must be inserted
before each message (see also [the Protocol Buffers documentation about streaming multiple messages](https://developers.google.com/protocol-buffers/docs/techniques#streaming)).

Thus, a file conforming to this specification looks like this:

| # | Type        | Description                                 |
|---|-------------|---------------------------------------------|
| 0 | varint      | Length of the following FileHeader message  |
| 1 | FileHeader  |                                             |
| 2 | varint      | Length of the following Instruction message |
| 3 | Instruction | First instruction                           |
| 4 | varint      | Length of the following Instruction message |
| 5 | Instruction | Second instruction                          |
| - | ...         | More instructions...                        |

## Possible extensions
It is possible to extend vtproto with new features.

Here is a list of ideas for possible extensions:

- Custom waveforms, by adding instructions to define custom samples and to
  select them as waveforms for an actuator or actuator group
- Mixing signals, by introducing virtual channels and adding an instruction that
  lets you mix virtual channels together, possibly using custom mixing functions
- More efficient definition of channel groups by adding an instruction that
  allows passing in channel ranges instead of individual channel IDs
- Interpolation using other methods than linear interpolation, by introducing
  a interpolation type argument to the `INTERPOLATE_*` instructions

Additionally, it is possible to combine vtproto files with generic compression
algorithms. The efficiency of such combinations has not yet been researched.
There might even be the possibility to create specialized compression algorithms
for vibrotactile patterns, especially for larger displays, that may be based on
(or map to) vtproto.

## License
This specification is Copyright 2021 Lucas Hinderberger and licensed
under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The enclosed file `vtproto.proto` is released
under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
