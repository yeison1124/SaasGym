-- ==============================================================================
-- GetGym SaaS: Limpieza de auth.users para creación limpia vía Admin API
-- ==============================================================================

DELETE FROM auth.users WHERE email IN (
    'roberto@ironstrength.co',
    'diego@elitegym.mx',
    'laura@powerhub.ar',
    'nico@getgym.app',
    'testroberto@ironstrength.co'
);
