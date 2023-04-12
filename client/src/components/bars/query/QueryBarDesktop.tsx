import { type FC, useState } from 'react';
import styles from './styles.module.css';
import { Anchor, Select } from '@/components/ui';
import classNames from 'clsx';

const languageOptions = [
  {
    name: 'English',
    value: 'en',
  },
  {
    name: 'Ukrainian',
    value: 'uk',
  },
];

const QueryBar: FC = () => {
  const [language, setLanguage] = useState<number>(-1);

  return (
    <header className={styles.navbar}>
      <section className={classNames(styles.section, styles.main)}>
        <div className={styles.query}>
          <input
            type="text"
            placeholder="I'm looking for..."
            required
            className={styles.input}
          />
          <i
            className={classNames(
              'material-icons-round pr-2 text-black opacity-60',
              styles.icon,
            )}
          >
            search
          </i>
        </div>
      </section>
      <section className={styles.section}>
        <i className="material-icons-round text-black opacity-60">language</i>
        <Select
          className={classNames(styles.select)}
          selected={language}
          setSelected={setLanguage}
          options={languageOptions}
        />
      </section>
    </header>
  );
};

export default QueryBar;
