# Shopify
THE only cart/checkout/payment surface, group-wide (locked decision — PROJECT_CONTEXT §9).
- Product microsites use packages/product-card (Storefront API) → buy on the main Shopify store.
- Never build checkout, cart, or payment forms anywhere else. Never store payment data.
- data-cta event: add_to_cart_assist → assisted-revenue KPI in Fleet Pulse.
- Post-sprint queue: theme code under Git, storefront QA agent (Runbook §8).
