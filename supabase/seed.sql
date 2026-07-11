-- T021: Seed data (categories + menu items matching existing mock data)

INSERT INTO public.categories (name, display_order) VALUES
    ('Starters', 1),
    ('Fast Food', 2),
    ('Chai', 3),
    ('Pasta & Chinese', 4),
    ('Pizzeria', 5),
    ('Barbeque', 6),
    ('Dessert', 7)
ON CONFLICT DO NOTHING;

-- menu_items (assumes categories inserted above with known display_order)
DO $$
DECLARE
    starters_id      uuid; fast_food_id uuid; chai_id uuid;
    pasta_id         uuid; pizzeria_id  uuid; bbq_id uuid; dessert_id uuid;
BEGIN
    SELECT id INTO starters_id   FROM public.categories WHERE display_order = 1;
    SELECT id INTO fast_food_id  FROM public.categories WHERE display_order = 2;
    SELECT id INTO chai_id       FROM public.categories WHERE display_order = 3;
    SELECT id INTO pasta_id      FROM public.categories WHERE display_order = 4;
    SELECT id INTO pizzeria_id   FROM public.categories WHERE display_order = 5;
    SELECT id INTO bbq_id        FROM public.categories WHERE display_order = 6;
    SELECT id INTO dessert_id    FROM public.categories WHERE display_order = 7;

    INSERT INTO public.menu_items (category_id, name, description, price) VALUES
        (starters_id,  'Chicken Spring Rolls',       'Crispy fried spring rolls filled with spicy chicken',          350),
        (starters_id,  'Vegetable Samosa (4 pcs)',    'Deep-fried pastry filled with spiced potatoes and peas',      200),
        (fast_food_id, 'Zinger Burger',               'Crispy chicken fillet with lettuce and mayo in a sesame bun', 450),
        (fast_food_id, 'Club Sandwich',               'Grilled triple-layer sandwich with chicken, egg, and veg',    420),
        (chai_id,      'Doodh Pati Chai',             'Traditional milky tea brewed with cardamom',                  120),
        (chai_id,      'Kashmiri Chai',               'Pink, creamy tea with nuts — a Kashmiri specialty',           180),
        (pasta_id,     'Chicken Alfredo Pasta',       'Creamy white sauce pasta with grilled chicken',               520),
        (pasta_id,     'Chicken Fried Rice',           'Wok-fried rice with chicken, egg, and vegetables',           420),
        (pizzeria_id,  'Chicken Fajita Pizza (Medium)','Spicy chicken fajita topping with bell peppers and onions',   750),
        (pizzeria_id,  'BBQ Chicken Pizza (Large)',   'Tangy BBQ sauce base with grilled chicken and cheese',        1050),
        (bbq_id,       'Chicken Tikka (Half)',        'Spiced and chargrilled chicken legs',                         480),
        (bbq_id,       'Seekh Kebab (6 pcs)',         'Minced beef skewers with herbs and spices',                   550),
        (bbq_id,       'Bihari Boti',                 'Tender marinated beef cooked on the grill',                   620),
        (dessert_id,   'Gulab Jamun (4 pcs)',         'Deep-fried milk solids soaked in rose syrup',                 250),
        (dessert_id,   'Kheer',                       'Creamy rice pudding with cardamom and nuts',                  280);
END $$;
