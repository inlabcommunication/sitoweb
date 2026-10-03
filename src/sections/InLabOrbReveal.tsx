import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

function pad<T>(input: number[], output: T[]): [number[], T[]] {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) { i.unshift(0); o.unshift(o[0]); }
  if (i[i.length - 1] < 1) { i.push(1); o.push(o[o.length - 1]); }
  return [i, o];
}

const useScrollTransform = <T,>(mv: MotionValue<number>, input: number[], output: T[]) => {
  const [i, o] = pad(input, output);
  return useTransform<number, T>(mv, i, o);
};

export const InLabOrbReveal: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const orbScale = useScrollTransform(scrollYProgress, [0, 0.62], reduced ? [30, 30] : [1, 30]);
  const introOpacity = useScrollTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const introScale = useScrollTransform(scrollYProgress, [0, 0.22], [1, reduced ? 1 : 0.85]);
  const contentOpacity = useScrollTransform(scrollYProgress, [0.42, 0.6], [0, 1]);
  const contentY = useScrollTransform(scrollYProgress, [0.42, 0.6, 1], reduced ? [0, 0, 0] : [60, 0, -20]);

  return (
    <section ref={ref} className="orb">
      <OrbStyles />
      <div className="orb-scene">
        <motion.div className="orb-dot" style={{ scale: orbScale }} />
        <motion.div className="orb-intro" style={{ opacity: introOpacity, scale: introScale }}>
          <p>Un brand, un ecosistema.</p>
        </motion.div>
        <motion.div className="orb-content" style={{ opacity: contentOpacity, y: contentY }}>
          <h2>Una strategia.<br /><em>Più punti di contatto.</em></h2>
          <p>Social, contenuti, advertising, web e identità lavorano insieme per portare il tuo brand dalla visibilità alla crescita.</p>
        </motion.div>
      </div>
    </section>
  );
};

const OrbStyles = () => (
  <style>{`
    .orb{position:relative;height:220vh;background:var(--bg)}
    .orb-scene{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:grid;place-items:center}
    .orb-dot{
      position:absolute;left:50%;top:50%;
      width:110px;height:110px;margin:-55px 0 0 -55px;
      border-radius:50%;background:var(--a);
      will-change:transform;
    }
    .orb-intro{position:absolute;top:20svh;left:0;right:0;text-align:center;pointer-events:none}
    .orb-intro p{font-family:var(--fs);font-style:italic;font-size:clamp(1.6rem,3vw,2.6rem);color:var(--t)}
    .orb-content{position:relative;z-index:2;max-width:1000px;padding:0 1.5rem;text-align:center;color:#171619}
    .orb-content h2{font-family:var(--fd);font-weight:400;font-size:clamp(3.6rem,9vw,9rem);line-height:.82;text-transform:uppercase}
    .orb-content h2 em{display:block;margin-top:.15em;font-family:var(--fs);font-size:.5em;text-transform:none;line-height:1}
    .orb-content p{max-width:480px;margin:2rem auto 0;font-size:17px;line-height:1.65;color:rgba(23,22,25,.7)}
    @media (max-width:767px){
      .orb{height:180vh}
    }
  `}</style>
);
