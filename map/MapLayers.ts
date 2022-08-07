import {h} from "vue";
import {LTileLayer} from "@vue-leaflet/vue-leaflet";

export const mapLayers = [
    {
        name: 'خیابانی',
        attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        isSatellite: false,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        opacity: 1
    },
    {
        name: 'ماهواره ای',
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9\n/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVzc2Vpbm1pcnpha2kiLCJhIjoiY2t2YjVqNmhlMGEwODMxbHF4ZzR2bngxNSJ9.hPdJo6eWtbF0ZSfMoro7qQ',
        isSatellite: true,
        opacity: 1
    },
];

export function buildLayers(layers, tileProvider, satellite: boolean) {
    layers.push(h(LTileLayer, {
        key: tileProvider.name,
        name: tileProvider.name,
        visible: (tileProvider.isSatellite && satellite) || (!tileProvider.isSatellite && !satellite),
        url: tileProvider.url,
        opacity: tileProvider.opacity,
        attribution: tileProvider.attribution,
        'layer-type': 'base',
    }));
}