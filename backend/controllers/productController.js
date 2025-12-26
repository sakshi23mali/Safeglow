import axios from "axios";

// ---------------- SMART SAFETY ANALYSIS ----------------
function analyzeSafetyForSkinType(skinType, text) {
  const lower = (text || "").toLowerCase();

  // Generic flags
  const hasFragrance =
    lower.includes("fragrance") ||
    lower.includes("parfum") ||
    lower.includes("perfume");

  const hasHarshAlcohol =
    lower.includes("alcohol denat") ||
    lower.includes("denatured alcohol");

  const hasScrubOrPeel =
    lower.includes("scrub") ||
    lower.includes("exfoliating") ||
    lower.includes("peeling") ||
    lower.includes("peel");

  const isHeavyProduct =
    lower.includes("heavy cream") ||
    lower.includes("rich cream") ||
    lower.includes("body butter") ||
    lower.includes("facial oil") ||
    lower.includes("nourishing oil") ||
    lower.includes("face oil");

  const mentionsOily =
    lower.includes("for oily skin") ||
    lower.includes("oily skin") ||
    lower.includes("oil control") ||
    lower.includes("oil-control") ||
    lower.includes("oil free") ||
    lower.includes("oil-free") ||
    lower.includes("mattifying") ||
    lower.includes("matte finish") ||
    lower.includes("anti acne") ||
    lower.includes("acne control");

  const mentionsDry =
    lower.includes("for dry skin") ||
    lower.includes("dry skin") ||
    lower.includes("very dry skin") ||
    lower.includes("intense hydration") ||
    lower.includes("deeply moisturizing") ||
    lower.includes("extra nourishing");

  const mentionsSensitive =
    lower.includes("for sensitive skin") ||
    lower.includes("sensitive skin");

  const brighteningActives =
    lower.includes("brightening") ||
    lower.includes("whitening") ||
    lower.includes("lightening") ||
    lower.includes("retinol") ||
    lower.includes("vitamin c") ||
    lower.includes("aha") ||
    lower.includes("bha") ||
    lower.includes("peel");

  // ---- Rules based on skinType ----
  switch (skinType) {
    case "dry":
      // Dry skin ko oily-targeted / mattifying cheezein avoid
      if (mentionsOily) return "avoid";
      if (hasHarshAlcohol) return "avoid";
      if (hasScrubOrPeel || hasFragrance) return "caution";
      break;

    case "oily":
      // Oily skin ko bohot rich / dry-skin waale avoid
      if (isHeavyProduct || mentionsDry) return "avoid";
      if (mentionsSensitive) return "caution";
      break;

    case "combination":
      if (isHeavyProduct && mentionsDry) return "avoid";
      if (mentionsOily || mentionsDry) return "caution";
      if (hasFragrance) return "caution";
      break;

    case "sensitive":
      if (hasFragrance || hasHarshAlcohol || hasScrubOrPeel) return "avoid";
      if (brighteningActives) return "caution";
      break;

    case "normal":
    default:
      if (hasHarshAlcohol || isHeavyProduct) return "caution";
      break;
  }

  // Kuch bhi risky flag nahi mila
  return "safe";
}

// ---------------- MAIN CONTROLLER ----------------
export const recommendProducts = async (req, res) => {
  try {
    const { skinType } = req.query;

    if (!skinType) {
      return res.status(400).json({ error: "skinType query is required" });
    }

    // Tumhare .env ke names:
    const apiKey = process.env.GOOGLE_CSE_KEY;
    const cx = process.env.GOOGLE_CSE_CX;

    if (!apiKey || !cx) {
      console.error("CSE keys missing", { apiKey, cx });
      return res.status(500).json({ error: "CSE keys missing" });
    }

    const query = `${skinType} skin best skincare products`;

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&cx=${cx}`;

    const response = await axios.get(url);
    const items = response.data.items || [];

    const results = items.map((item) => {
      const title = item.title || "";
      const snippet = item.snippet || "";
      const link = item.link || "";
      const source =
        item.displayLink || item.link?.split("/")[2] || "Unknown";

      const image =
        item.pagemap?.cse_image?.[0]?.src ||
        item.pagemap?.imageobject?.[0]?.url ||
        null;

      const verdict = analyzeSafetyForSkinType(
        skinType,
        `${title} ${snippet}`
      );

      return {
        title,
        snippet,
        link,
        source,
        image,
        verdict,
      };
    });

    // Frontend yahi expect karta hai:
    res.json({ products: results });
  } catch (error) {
    console.error("Error in recommendProducts:", error.message);
    res.status(500).json({ error: "Failed to fetch product data" });
  }
};