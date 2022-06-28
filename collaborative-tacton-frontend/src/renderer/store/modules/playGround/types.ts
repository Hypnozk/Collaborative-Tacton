export enum PlayGroundActionTypes {
    activateKey = 'activateKey',
    deactivateKey = "deactivateKey",
    addButtonToGrid = 'addButtonToGrid',
    updateKeyButton = "updateKeyButton",
    pressButtonActivated = 'pressButtonActivated',
    pressButtonDeactivated = "pressButtonDeactivated",
}
export enum PlayGroundMutations {
    BULK_GRID_UPDATE = "BULK_GRID_UPDATE",
    UPDATE_GRID_ITEM = "UPDATE_GRID_ITEM",
    ADD_ITEM_TO_GRID = "UPDATE_ITEM_TO_GRID",
    UPDATE_GLOBAL_INTENSITY = "UPDATE_GLOBAL_INTENSITY",
    DELETE_ITEM_FROM_GRID = "DELETE_ITEM_FROM_GRID",
    UPDATE_EDIT_MDOE = "UPDATE_EDIT_MDOE",
    ADD_PRESSED_KEY = "ADD_PRESSED_KEY",
    DELETE_PRESSED_KEY = "DELETE_PRESSED_KEY"
}