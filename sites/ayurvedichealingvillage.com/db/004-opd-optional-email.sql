-- The rendered OPD form marks email as optional. Keep its table contract in
-- sync so a valid form without an email can be stored instead of rejected.
ALTER TABLE `opd`
  MODIFY COLUMN `email` varchar(190) NULL;
