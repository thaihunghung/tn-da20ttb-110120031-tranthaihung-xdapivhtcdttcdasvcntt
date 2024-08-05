import React from "react";

export function handleReplaceCharacters(description){
  let result = description.replace(/ /g, "_");
  result = result.replace(/-/g, "_");
  result = result.replace(/___/g, "_");
  result = result.toLowerCase();
  result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  result = result.replace(/_+/g, "_");
  result = result.replace(/^_+|_+$/g, "");
  return result;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
