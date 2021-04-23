let translation;

 async function calc(document, translation, type, localStorage) {
    translation = await translation;
    let chargeL = Array.from(document.getElementsByClassName("z_left"));
    let massL = Array.from(document.getElementsByClassName("m_left"));
    let chargeR = Array.from(document.getElementsByClassName("z_right"));
    let massR = Array.from(document.getElementsByClassName("m_right"));
    let elements = document.getElementsByClassName("element");
    let names = document.getElementsByClassName("name");
    let emptyChargeL = findEmpty(chargeL);
    let emptyChargeR = findEmpty(chargeR);
    if (
        compareArr(emptyChargeL, findEmpty(massL)) &&
        compareArr(emptyChargeR, findEmpty(massR))
    ) {
        //allows to not check for empty mass fields
        if (emptyChargeL.length + emptyChargeR.length >= 1) {
                if (type == 12) {
                    calc1to2(
                        emptyChargeL,
                        emptyChargeR,
                        chargeL,
                        massL,
                        chargeR,
                        massR
                    );
                } else if (type == 21) {
                    calc2to1(
                        emptyChargeL,
                        emptyChargeR,
                        chargeL,
                        massL,
                        chargeR,
                        massR
                    );
                } else if (type == 22) {
                    calc2to2(
                        emptyChargeL,
                        emptyChargeR,
                        chargeL,
                        massL,
                        chargeR,
                        massR
                    );
                }
            if (verify(chargeL, massL, chargeR, massR) && checkMass(chargeL.concat(chargeR), massL.concat(massR))) {
                setElements(
                    elements,
                    chargeL.concat(chargeR),
                    massL.concat(massR),
                    names,
                    localStorage
                );
            } else alert(translation.err_wrong);
        } else alert(translation.err_notenough);
    } else alert(translation.err_checkmz);
}

function calc1to2(emptyChargeL, emptyChargeR, chargeL, massL, chargeR, massR) {
    if (emptyChargeL.length == 1) {
        chargeL[0].value = Number(chargeR[0].value) + Number(chargeR[1].value);
        massL[0].value = Number(massR[0].value) + Number(massR[1].value);
    } else {
        chargeR[emptyChargeR[0]].value =
            Number(chargeL[0].value) -
            Number(chargeR[Number(!emptyChargeR[0])].value);
        massR[emptyChargeR[0]].value =
            Number(massL[0].value) -
            Number(massR[Number(!emptyChargeR[0])].value);
    }
}

function calc2to1(emptyChargeL, emptyChargeR, chargeL, massL, chargeR, massR) {
    if (emptyChargeR.length == 1) {
        chargeR[0].value = Number(chargeL[0].value) + Number(chargeL[1].value);
        massR[0].value = Number(massL[0].value) + Number(massL[1].value);
    } else {
        chargeL[emptyChargeL[0]].value =
            Number(chargeR[0].value) -
            Number(chargeL[Number(!emptyChargeL[0])].value);
        massL[emptyChargeL[0]].value =
            Number(massR[0].value) -
            Number(massL[Number(!emptyChargeL[0])].value);
    }
}

function calc2to2(emptyChargeL, emptyChargeR, chargeL, massL, chargeR, massR) {
    if (emptyChargeL.length == 1) {
        chargeL[emptyChargeL[0]].value =
            Number(chargeR[0].value) +
            Number(chargeR[1].value) -
            Number(chargeL[Number(!emptyChargeL[0])].value);
        massL[emptyChargeL[0]].value =
            Number(massR[0].value) +
            Number(massR[1].value) -
            Number(massL[Number(!emptyChargeL[0])].value);
    } else {
        chargeR[emptyChargeR[0]].value =
            Number(chargeL[0].value) +
            Number(chargeL[1].value) -
            Number(chargeR[Number(!emptyChargeR[0])].value);
        massR[emptyChargeR[0]].value =
            Number(massL[0].value) +
            Number(massL[1].value) -
            Number(massR[Number(!emptyChargeR[0])].value);
    }
}

function checkMass(charge, mass) {
    for (let i = 0; i < charge.length; i++) {
        if (Number(charge[i].value) > Number(mass[i].value)) return false;
    }
    return true;
}

function verify(chargeL, massL, chargeR, massR) {
    let totalChargeL = 0;
    let totalMassL = 0;
    let totalChargeR = 0;
    let totalMassR = 0;
    for (let i = 0; i < chargeL.length; i++) {
        totalChargeL += Number(chargeL[i].value);
        totalMassL += Number(massL[i].value);
    }
    for (let i = 0; i < chargeR.length; i++) {
        totalChargeR += Number(chargeR[i].value);
        totalMassR += Number(massR[i].value);
    }
    if (totalChargeL == totalChargeR && totalMassL == totalMassR) return true;
    return false;
}
async function setElements(elements, charges, masses, names, localStorage) {
    let ptable = await fetch("../json/elements.json");
    ptable = await ptable.json();
    for (let i = 0; i < elements.length; i++) {
        let desc;
        if (charges[i].value == -1 && masses[i].value == 0) {
            desc = {
                symbol: "e",
                name_en: "Electron",
                name_ru: "Электрон",
            };
        } else if (charges[i].value == 0 && masses[i].value == 1) {
            desc = {
                symbol: "n",
                name_en: "Neutron",
                name_ru: "Нейтрон",
            };
        } else if (charges[i].value == 1 && masses[i].value == 1) {
            desc = {
                symbol: "p",
                name_en: "Proton",
                name_ru: "Протон",
            };
        } else {
            desc = ptable[Number(charges[i].value) - 1] || {
                symbol: "?",
                name_en: "Unknown",
                name_ru: "Неизвестно",
            };
        }
        elements[i].textContent = desc.symbol;
        names[i].textContent = desc[`name_${localStorage.lang}`] || desc.name_en
    }
}

function findEmpty(arr) {
    empty = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value == "") empty.push(i);
    }
    return empty;
}

function compareArr(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}


async function translate(document, navigator) {
    let lang = localStorage.lang || navigator.language.substring(0,2);
    if(!localStorage.lang) {
        localStorage.lang = lang;
    }
    const translation = await (await fetch(`./json/${lang}.json`)).json();
    if (document.title.substring(0, 1) == "N") {
        let entries = document.getElementsByClassName("entry");
        entries[0].textContent = translation.entry_decay + " (A → B + C)";
        entries[1].textContent = translation.entry_trans + " (A + B → C)";
        entries[2].textContent = translation.entry_synth + " (A + B → C + D)";
    }
    else {
        let names = document.getElementsByClassName("name");
        let solve = document.getElementsByClassName("btn_solve");
        let back = document.getElementsByClassName("lnk_back");
        let clear = document.getElementsByClassName("btn_clear");
        let abcd = ["A", "B", "C", "D"];
        for (let i = 0; i < names.length; i++) {
            names[i].textContent = `${translation.txt_element} ${abcd[i]}`
        }
        solve[0].value = translation.btn_solve;
        clear[0].value = translation.btn_clear;
        back[0].textContent = translation.txt_back;
    }
    let change_lang = document.getElementsByClassName("lnk_lang");
    change_lang[0].textContent = translation.lang;
    return translation;
}

async function changeLang(document, navigator, localStorage) {
    if (localStorage.lang == "en") {
        localStorage.lang = "ru";
    }
    else localStorage.lang = "en";
    translate(document, navigator);
}

async function reset(document, translation) {
    translation = await translation;
    let charges = Array.from(document.getElementsByClassName("z_left")).concat(Array.from(document.getElementsByClassName("z_right")));
    let masses = Array.from(document.getElementsByClassName("m_left")).concat(Array.from(document.getElementsByClassName("m_right")));
    let elements = document.getElementsByClassName("element");
    let names = document.getElementsByClassName("name");
    let abcd = ["A", "B", "C", "D"];
    for (let i = 0; i < charges.length ; i++) {
        charges[i].value = "";
        masses[i].value = "";
        elements[i].textContent = abcd[i];
        names[i].textContent = `${translation.txt_element}  ${abcd[i]}`;
    }

}