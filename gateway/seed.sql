INSERT INTO maps (id, name, data)
VALUES (
  gen_random_uuid(),
  'default-map',
  '[
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1]
  ]'
)
ON CONFLICT DO NOTHING;
