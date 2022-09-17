extern crate wasm_bindgen;
extern crate geojson;
extern crate contour;
extern crate colorbrewer;
use wasm_bindgen::prelude::*;
use geojson::{FeatureCollection, GeoJson, JsonValue};
use colorbrewer::{Palette, get_color_ramp};
use contour::ContourBuilder;

mod utils {
    pub fn set_panic_hook() {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();
    }
}

#[wasm_bindgen]
pub fn make_contours(values: &[f64], thresholds: &[f64], x: u32, y: u32) -> String {
    utils::set_panic_hook();
    let n = thresholds.len();
    // Get a Vec of colors from colorbrewer PuOr Palette
    let colors = get_color_ramp(Palette::PiYG, n as u32).unwrap();
    // Build the contours
    let c = ContourBuilder::new(x, y, true);
    let mut features = c.contours(values, thresholds).unwrap();
    // Iterate over features to add color property
    for (i, f) in features.iter_mut().enumerate() {
        let color: JsonValue = colors[i].to_string().into();
        f.properties.as_mut().unwrap().insert("color".to_string(), color);
    }
    // Return result serialised as GeoJSON
    GeoJson::from(FeatureCollection {
        bbox: None,
        features: features,
        foreign_members: None,
    }).to_string()
}
