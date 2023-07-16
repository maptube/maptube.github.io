/**
 * Sequencer.js
 * Sequences drone moves
 */

export { Sequencer }

class Sequencer
{
    constructor() {
        this.position=-1;
        this.sequence = [];
    }

    clear = () => {
        this.position=-1;
        this.sequence = [];
    }

    push = (fn_seq) => {
        this.sequence.push(fn_seq);
    }

    next = () => { //call next to start
        //console.log("Sequencer::next ",this.position);
        ++this.position;
        if (this.position<this.sequence.length) {
            console.log(this.sequence[this.position]);
            this.sequence[this.position].call(this);
        }
    }

}