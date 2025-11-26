
"use server"

export async function fetchCountriesWithFlags() {
    const res = await fetch("https://restcountries.com/v3.1/all");

    if (!res.ok) throw new Error("Failed to fetch countries");

    const data = await res.json();

    return data
        .map((country: any) => ({
            name: country.name.common,
            flag: country.flag,
            code: country.cca2, // Optional, if needed later
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
}

