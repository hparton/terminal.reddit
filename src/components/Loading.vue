<template>
  <div class="loading" v-if="!loaded">
    <pre class="ascii-logo">
                             .LLL:.       ~INMML:
                             7MMMMNNZ7~. :NM:  :MN:
                             NM:   ~=7MMMN:     :M.
                            :M:        ~MC.     .DM.
                            NI:          :N:    :N:
                           :MN            ~INIINI~
                          .MN:             ~:=:~
                          :MM
                       ,:$MM$:,
               ,:$NPMWMNMSMNMAMKMEMN$:,
    ,~~=    ~IMMMNI~              ~INMMMI~    =~~,
  :MNNNNMN$MMM~.                      .~MMM$NMNNNNM:
 :NI:  ,NMM~                              ~MMN,  :IN:
:M , IMM::         .               .        ::MMI , M:
:M , MMT        ,I7I7I,         ,I7I7I,       TMM , M:
.N7 ND,        .:$$77$:.       .:$77$$:.       ,CN 7N.
 :MMM,         :$7$777$:       :$7$777$:        ,MMM:
  ~MM          .~77777~.       .~77777~.         MM~
  ~MM           ,7$$$7,         ,7$$$7,          MM~
  ,MM            ,7I7,           ,7I7,           MM,
  :7M              ,               ,             M7:
   :D$                                          $C:
    :MO,         ,==.            .==,         ,OM:
     :MM          ,MMN:        :NMM,          MM:
      :ZM$         ,INMMMMMMMMMMNI,         $MZ:
       :7NM7,          ~=7777=~          ,7MN7:
          ~$IMMN7~,                ,~7NMMI~
              :IMMMMMMNN$III$NNMMMMMMI:
            NMMO   .~7$OMNOMNOML$~.  OMMN
           IMNZMI~                 ~IMZNMI
          ~M$ NMI~                 ~IMN $M~
         :N$  ZMI                   IMZ  $N:
         $M   NM~                   ~MN   M$
        :OM   MM~                   ~MM   MO:
        :DM.  NM~                   ~MN  .MD:
         $M   NMI                   IMN   M$
         :N$  ZMI                   IMZ  $N:
          ~M$ ~MI                   IM~ $M~
           MN: NM~                 ~MN :NM
            MNNMM~                 ~MMNNM
              ~MZD                 CZM~
               ~MN                 NM~
                ~DM               MM~
            ICMMMMMM             MMMMMMDL
           TMM~  :NM7           7MN:   ~MMT
          :MZ     :MD~         ~MD:      PM:
          OMO:::::::IMMD~.__.~CMMI=:::::::OMO
          IMMMMMMMMMMMMMREDDITMMMMMMMMMNMMMMI
    </pre>
    <progressBar :percentage="percentage" :length="40"></progressBar>
  </div>
</template>

<script>
import progressBar from './progressBar'

export default {
  name: 'loading',
  props: ['loading'],
  data () {
    return {
      percentage: 0,
      loaded: false
    }
  },
  created () {
    var self = this
    setInterval(function () {
      if (self.percentage < 100) {
        self.percentage++
      } else if (!self.loaded) {
        self.loaded = true
        self.$emit('loaded')
      }
    }, 20)
  },
  components: {
    progressBar
  }
}
</script>

<style>

  .ascii-logo {
    color: #d08770;
    display: table;
    margin: 1em auto;
    font-size: 0.5em;
  }

</style>
