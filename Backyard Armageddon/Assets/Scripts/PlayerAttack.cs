using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerAttack : MonoBehaviour {

    private float timeBetweenAttacks;
    public float startTimeBetweenAttacks;
    public Transform attackPosition;
    public LayerMask whatAreEnemies;

    public float attackRange;
    public int damage;

    void Update () {
        if(timeBetweenAttacks <= 0)
        {
            if (Input.GetKey(KeyCode.Space))
            {
                GetComponent<Animator>().SetTrigger("attack");
                Collider2D[] enemiesToDamage = Physics2D.OverlapCircleAll(attackPosition.position, attackRange, whatAreEnemies);
                if (enemiesToDamage.Length > 0)
                {
                    for (int i = 0; i < enemiesToDamage.Length; i++)
                    {
                        if (enemiesToDamage[i].tag != "Box" && enemiesToDamage[i].tag != "Water")
                        {
                            enemiesToDamage[i].GetComponent<Enemy>().TakeDamage(damage);
                        }
                        else
                        {
                            Inventory inventory = GetComponent<Inventory>();

                            for (int ii = 0; ii < inventory.slots.Length; ii++)
                            {
                                if (inventory.isFull[ii] == true)
                                {
                                    if (inventory.slots[ii].name.Contains("pickaxe"))
                                    {
                                        enemiesToDamage[i].GetComponent<BoxDestroy>().DestroyBox(true);
                                    }
                                }
                            }
                        }


                    }
                }
                timeBetweenAttacks = startTimeBetweenAttacks;
            }
        } else
        {
            timeBetweenAttacks -= Time.deltaTime;
        }
    }

    void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(attackPosition.position, attackRange);
    }
}
