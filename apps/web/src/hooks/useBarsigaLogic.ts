import dos_de_chica from '../assets/icons/cantos/dos_de_chica.webp'
import tres_de_nueve from '../assets/icons/cantos/tres_de_nueve.webp'
import escalera from '../assets/icons/cantos/escalera.webp'
import barsiga from '../assets/icons/cantos/barsiga.webp'
import flor from '../assets/icons/cantos/flor.webp'

export const useBarsigaLogic = () => {
    const CANTOS = [
        { id: 'barsiga', label: 'Barsiga', points: 10, icon: barsiga },
        { id: 'flor', label: 'Flor', points: 3, icon: flor },
        { id: 'escalera', label: 'Escalera', points: 3, icon: escalera  },
        { id: 'tres_de_nueve', label: 'Tres de nueve', points: 3, icon: tres_de_nueve },
        { id: 'dos_de_chica', label: 'Dos de Chica', points: 2,  icon: dos_de_chica },
    ];

    return { CANTOS };
};