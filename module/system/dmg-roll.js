export class AriaDamageRoll {
    constructor(label, formula,img){
        this._label = label;
        this._formula = formula;
        this._img = img;
    }

    async roll(actor,rollType){

        const messageTemplate = "systems/aria/templates/chat/weapon-card.hbs";

        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

        let r = new Roll(this._formula);
        r.evaluate({async:false});

        const calc = r.result;
        const mod = (r.terms.length > 1);

        let renderedRoll = await r.render();  
        
        
        const result = r.total;

        this._isFumble = (result == 0);

        let templateContextData = {
            actor: actor,
            label: this._label,
            img: this._img,
            text: this._buildDamageRollMessage(),
            isFumble:this._isFumble,
            formula: this._formula,
            result: result,
            calc:calc,
            mod:mod,
        };

        let chatData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({actor: actor}),
                roll: r,
                content: await renderTemplate(messageTemplate,templateContextData),
                sound: CONFIG.sounds.dice
            };

        switch (rollType) {
            case "PUBLIC" :
                chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.PUBLIC);
                break;
            case "BLIND" :
                chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.BLIND);
                break;
            case "SELF" :
                chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.SELF);
                break;
            case "PRIVATE" :
                chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.PRIVATE);
                break;
        }

        ChatMessage.create(chatData);
    }

    /* -------------------------------------------- */

    _buildDamageRollMessage() {
        let subtitle = `<div><strong>${this._label}</strong></div>`;
        return `<h2 class="damage">Jet de dommages</h2>${subtitle}`;
    }

}