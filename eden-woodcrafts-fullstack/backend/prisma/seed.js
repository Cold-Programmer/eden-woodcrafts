"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcryptjs_1.default.hash("Admin@12345", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@edenwoodcrafts.co.ke" },
        update: {},
        create: {
            name: "Samuel Njoroge",
            email: "admin@edenwoodcrafts.co.ke",
            phone: "254702543867",
            passwordHash: adminPassword,
            role: "ADMIN",
            emailVerified: true
        }
    });
    const customerPassword = await bcryptjs_1.default.hash("Customer@123", 12);
    await prisma.user.upsert({
        where: { email: "customer@example.com" },
        update: {},
        create: {
            name: "Test Customer",
            email: "customer@example.com",
            phone: "254712345678",
            passwordHash: customerPassword,
            role: "CUSTOMER",
            emailVerified: true
        }
    });
    const staffPassword = await bcryptjs_1.default.hash("Staff@12345", 12);
    await prisma.user.upsert({
        where: { email: "staff@edenwoodcrafts.co.ke" },
        update: {},
        create: {
            name: "Workshop Staff",
            email: "staff@edenwoodcrafts.co.ke",
            phone: "254722334455",
            passwordHash: staffPassword,
            role: "STAFF",
            emailVerified: true
        }
    });
    const categoryNames = [
        "Beds", "Sofas", "Dining Tables", "Office Furniture",
        "Kitchen Cabinets", "Wardrobes", "TV Stands", "Coffee Tables"
    ];
    const categories = await Promise.all(categoryNames.map((name) => prisma.category.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") }
    })));
    const sampleProducts = [
        {
            name: "Solid Mahogany Bed Frame",
            slug: "solid-mahogany-bed-frame",
            description: "A handcrafted 6x6ft bed frame made from solid mahogany with a hand-rubbed oil finish.",
            material: "Mahogany",
            price: 45000,
            stock: 6,
            dimensions: "183cm x 183cm x 110cm",
            category: "Beds",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80"
        },
        {
            name: "Modern 3-Seater Sofa",
            slug: "modern-3-seater-sofa",
            description: "A comfortable three-seater sofa with a solid wood frame and premium upholstery.",
            material: "Mvule + Fabric",
            price: 68000,
            stock: 4,
            dimensions: "210cm x 90cm x 85cm",
            category: "Sofas",
            image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
        },
        {
            name: "Oak Dining Table (6-Seater)",
            slug: "oak-dining-table-6-seater",
            description: "Solid oak dining table seating six, finished with a natural matte varnish.",
            material: "Oak",
            price: 52000,
            discount: 10,
            stock: 5,
            dimensions: "180cm x 90cm x 75cm",
            category: "Dining Tables",
            image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
        },
        {
            name: "Executive Office Desk",
            slug: "executive-office-desk",
            description: "A spacious executive desk with built-in drawers, crafted from solid pine.",
            material: "Pine",
            price: 38000,
            stock: 8,
            dimensions: "150cm x 75cm x 76cm",
            category: "Office Furniture",
            image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80"
        },
        {
            name: "Fitted Kitchen Cabinet Set",
            slug: "fitted-kitchen-cabinet-set",
            description: "Custom-fitted kitchen cabinetry with soft-close hinges and a durable laminate finish.",
            material: "MDF + Laminate",
            price: 120000,
            stock: 2,
            dimensions: "Made to fit your kitchen",
            category: "Kitchen Cabinets",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"
        },
        {
            name: "3-Door Wardrobe",
            slug: "3-door-wardrobe",
            description: "Spacious three-door wardrobe with hanging rail and shelving, in a walnut finish.",
            material: "Walnut Veneer",
            price: 42000,
            stock: 7,
            dimensions: "150cm x 60cm x 200cm",
            category: "Wardrobes",
            image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80"
        },
        {
            name: "Rustic TV Stand",
            slug: "rustic-tv-stand",
            description: "A rustic-style TV stand with open shelving, built from reclaimed timber.",
            material: "Reclaimed Wood",
            price: 21000,
            stock: 10,
            dimensions: "140cm x 40cm x 50cm",
            category: "TV Stands",
            image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=900&q=80"
        },
        {
            name: "Round Coffee Table",
            slug: "round-coffee-table",
            description: "A round coffee table with a live-edge top and hairpin legs.",
            material: "Mvule",
            price: 16000,
            stock: 12,
            dimensions: "70cm diameter x 45cm high",
            category: "Coffee Tables",
            image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=900&q=80"
        }
    ];
    for (const p of sampleProducts) {
        const category = categories.find((c) => c.name === p.category);
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                material: p.material,
                price: p.price,
                discount: p.discount || 0,
                stock: p.stock,
                dimensions: p.dimensions,
                categoryId: category.id,
                images: { create: [{ url: p.image, position: 0 }] }
            }
        });
    }

    const sampleProjects = [
        {
            title: "Kilimani Family Home — Fitted Wardrobes",
            location: "Kilimani, Nairobi",
            description: "Floor-to-ceiling walnut-veneer wardrobes fitted across three bedrooms, with soft-close drawers and a concealed shoe rack built into the base.",
            image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80",
            status: "COMPLETED",
            position: 1
        },
        {
            title: "Westlands Office — Boardroom Table",
            location: "Westlands, Nairobi",
            description: "A 12-seater solid oak boardroom table with integrated cable trays, built to match an existing reception desk in the same wood.",
            image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1000&q=80",
            status: "COMPLETED",
            position: 2
        },
        {
            title: "Karen Residence — Outdoor Deck Seating",
            location: "Karen, Nairobi",
            description: "Weather-treated mahogany bench seating and a matching low table for a covered patio, finished with an exterior-grade oil.",
            image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1000&q=80",
            status: "IN_PROGRESS",
            position: 3
        },
        {
            title: "Kasarani Restaurant — Booth Seating",
            location: "Kasarani, Nairobi",
            description: "Upholstered booth seating and matching tables for an eight-booth dining area, built for daily commercial use.",
            image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1000&q=80",
            status: "COMPLETED",
            position: 4
        }
    ];

    for (const proj of sampleProjects) {
        const existing = await prisma.project.findFirst({ where: { title: proj.title } });
        if (!existing) {
            await prisma.project.create({ data: proj });
        }
    }

    console.log("Seed complete.");
    console.log(`Admin login: admin@edenwoodcrafts.co.ke / Admin@12345`);
    console.log(`Staff login: staff@edenwoodcrafts.co.ke / Staff@12345`);
    console.log(`Customer login: customer@example.com / Customer@123`);
    console.log(`Admin user id: ${admin.id}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
