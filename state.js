
//Like an enum but worse 
const CONTROL_STATES = Object.freeze({
    "MOUSEMOVE" : 0,
    "KEYMOVE" : 1
});

const RAT_STATES = Object.freeze({
    "MOVEFORWARD" : 1,
    "ROTATELEFT" : 2,
    "ROTATERIGHT" : 4,
    "MOVEBACKWARD" : 8,
    "SPRINTING" : 16
})

const VIEW_STATES = Object.freeze({
    "TOP_VIEW" : 0,
    "RAT_VIEW" : 1,
    "OBSERVATION_VIEW" : 2
})

export { CONTROL_STATES, RAT_STATES, VIEW_STATES };
