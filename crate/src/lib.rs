extern crate wasm_bindgen;
extern crate geojson;
extern crate contour;
use wasm_bindgen::prelude::*;
use geojson::{FeatureCollection, GeoJson};
use contour::ContourBuilder;

#[wasm_bindgen]
pub fn make_contours(values: &[f64], thresholds: &[f64], x: u32, y: u32) -> String {
    let c = ContourBuilder::new(x, y, true);
    GeoJson::from(FeatureCollection {
        bbox: None,
        features: c.contours(values, thresholds),
        foreign_members: None,
    }).to_string()
}
